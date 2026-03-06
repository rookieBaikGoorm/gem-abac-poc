import { PolicyHandler } from './policy-handler.interface';
import { AppAbility } from '../interface';
import { type Action } from '../constant/action.constant';
import { type Subject } from '../constant/subject.constant';

interface PolicyOptions {
  action: Action;
  subject: Subject;
}

/**
 * Guard 레벨의 PolicyHandler 생성 팩토리.
 * 해당 action+subject 에 대한 룰이 존재하는지만 확인한다 (conditions 무시).
 * 리소스 단위의 세밀한 검증은 Service 레이어에서 처리한다.
 */
export class PolicyHandlerFactory {
  static create({ action, subject }: PolicyOptions): PolicyHandler {
    return {
      handle(ability: AppAbility): boolean {
        return ability.can(action, subject);
      },
    };
  }
}
