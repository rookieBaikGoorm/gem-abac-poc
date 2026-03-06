import { Injectable, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { subject as caslSubject, ForbiddenError } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';
import { AppAbility } from '../interface';
import { type Action } from '../constant/action.constant';
import { type Subject } from '../constant/subject.constant';

interface AccessControlOptions {
  action: Action;
  subject: Subject;
  resource?: Record<string, any>;
}

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
  authorize({ action, subject, resource }: AccessControlOptions): void {
    const ability = this.getAbility();
    try {
      ForbiddenError.from(ability).throwUnlessCan(
        action,
        resource ? caslSubject(subject, resource) : subject,
      );
    } catch {
      throw new ForbiddenException(`Cannot ${action} on ${subject}`);
    }
  }

  /** 조건부 체크 - boolean 반환 */
  can({ action, subject, resource }: AccessControlOptions): boolean {
    const ability = this.getAbility();
    if (resource) {
      return ability.can(action, caslSubject(subject, resource));
    }
    return ability.can(action, subject);
  }

  /** Mongoose 쿼리용 ABAC 필터 - $and 로 기존 쿼리와 안전하게 결합할 것 */
  getAccessibleQuery({
    action,
    subject,
  }: Omit<AccessControlOptions, 'resource'>) {
    const ability = this.getAbility();
    return accessibleBy(ability, action).ofType(subject);
  }
}
