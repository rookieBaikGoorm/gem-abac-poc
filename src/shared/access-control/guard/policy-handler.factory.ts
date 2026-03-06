import { subject as caslSubject } from '@casl/ability';
import { PolicyHandler } from './policy-handler.interface';
import { AppAbility } from '../interface';
import { type Action } from '../constant/action.constant';
import { type Subject } from '../constant/subject.constant';

interface ScopeOptions {
  action: Action;
  subject: Subject;
}

interface ResourceOptions extends ScopeOptions {
  param?: string;
}

export class PolicyHandlerFactory {
  static createForScope({ action, subject }: ScopeOptions): PolicyHandler {
    return {
      handle(ability: AppAbility): boolean {
        return ability.can(action, caslSubject(subject, {}));
      },
    };
  }

  static createForResource({
    action,
    subject,
    param = 'id',
  }: ResourceOptions): PolicyHandler {
    return {
      handle(ability: AppAbility, params?: Record<string, string>): boolean {
        const id = params?.[param];
        if (!id) return false;
        return ability.can(action, caslSubject(subject, { id }));
      },
    };
  }
}
