import { Injectable } from '@nestjs/common';
import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { AppAbility, PolicyRule } from '../interface';
import { Effect } from '../constant';

@Injectable()
export class CaslAbilityFactory {
  /**
   * Group + User 정책을 병합하여 Ability를 생성한다.
   * 등록 순서: Group Allow -> User Allow -> Group Deny -> User Deny
   * CASL 의 "뒤에 정의된 룰이 우선" 특성에 의해 User Deny 가 최우선.
   */
  createForUser(
    groupRules: PolicyRule[],
    userRules: PolicyRule[] = [],
  ): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

    this.applyRules(builder, groupRules, Effect.ALLOW, 'can');
    this.applyRules(builder, userRules, Effect.ALLOW, 'can');
    this.applyRules(builder, groupRules, Effect.DENY, 'cannot');
    this.applyRules(builder, userRules, Effect.DENY, 'cannot');

    return builder.build();
  }

  private applyRules(
    builder: AbilityBuilder<AppAbility>,
    rules: PolicyRule[],
    effect: Effect,
    method: 'can' | 'cannot',
  ): void {
    for (const rule of rules.filter((r) => r.effect === effect)) {
      this.applyRule(builder, rule, method);
    }
  }

  private applyRule(
    builder: AbilityBuilder<AppAbility>,
    rule: PolicyRule,
    method: 'can' | 'cannot',
  ): void {
    const subject = rule.subject === '*' ? 'all' : rule.subject;

    const conditions: Record<string, any> = {};
    if (!rule.resources.includes('*')) {
      conditions.id = { $in: rule.resources };
    }
    if (rule.condition) {
      Object.assign(conditions, rule.condition);
    }

    const cond = Object.keys(conditions).length > 0 ? conditions : undefined;

    for (const actionName of rule.actions) {
      const action = actionName === '*' ? 'manage' : actionName;
      builder[method](action, subject, cond);
    }
  }
}
