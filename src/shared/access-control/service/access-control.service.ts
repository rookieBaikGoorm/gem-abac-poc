import { Injectable, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { subject as caslSubject, ForbiddenError } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';
import { AppAbility } from '../interface';

@Injectable()
export class AccessControlService {
  constructor(private readonly cls: ClsService) {}

  getAbility(): AppAbility {
    const ability = this.cls.get<AppAbility>('ability');
    if (!ability) {
      throw new ForbiddenException('Ability not initialized');
    }
    return ability;
  }

  /** 단일 리소스 권한 체크 - 실패 시 ForbiddenException */
  authorize(
    action: string,
    subjectType: string,
    resource?: Record<string, any>,
  ): void {
    const ability = this.getAbility();
    try {
      ForbiddenError.from(ability).throwUnlessCan(
        action,
        resource ? caslSubject(subjectType, resource) : subjectType,
      );
    } catch {
      throw new ForbiddenException(`Cannot ${action} on ${subjectType}`);
    }
  }

  /** 조건부 체크 - boolean 반환 */
  can(
    action: string,
    subjectType: string,
    resource?: Record<string, any>,
  ): boolean {
    const ability = this.getAbility();
    if (resource) {
      return ability.can(action, caslSubject(subjectType, resource));
    }
    return ability.can(action, subjectType);
  }

  /** Mongoose 쿼리용 ABAC 필터 - $and 로 기존 쿼리와 안전하게 결합할 것 */
  getAccessibleQuery(action: string, subjectType: string) {
    const ability = this.getAbility();
    return accessibleBy(ability, action).ofType(subjectType);
  }
}
