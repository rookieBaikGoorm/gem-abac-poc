import { subject as caslSubject } from '@casl/ability';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PolicyRule } from '../interface';
import { Effect } from '../constant';

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory;

  beforeEach(() => {
    factory = new CaslAbilityFactory();
  });

  const rule = (overrides: Partial<PolicyRule> = {}): PolicyRule => ({
    effect: Effect.ALLOW,
    subject: 'Course',
    actions: ['Read'],
    resources: ['*'],
    ...overrides,
  });

  describe('createForUser', () => {
    it('Allow 룰이 있으면 해당 액션을 허용한다', () => {
      const ability = factory.createForUser([
        rule({ actions: ['Read'], subject: 'Course' }),
      ]);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Update', caslSubject('Course', {}))).toBe(false);
    });

    it('Deny 룰이 Allow 룰을 덮어쓴다', () => {
      const ability = factory.createForUser([
        rule({
          effect: Effect.ALLOW,
          actions: ['Read', 'Update'],
          subject: 'Course',
        }),
        rule({ effect: Effect.DENY, actions: ['Update'], subject: 'Course' }),
      ]);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Update', caslSubject('Course', {}))).toBe(false);
    });

    it('User Deny가 Group Allow를 덮어쓴다', () => {
      const groupRules = [
        rule({
          effect: Effect.ALLOW,
          actions: ['Read', 'Update'],
          subject: 'Course',
        }),
      ];
      const userRules = [
        rule({ effect: Effect.DENY, actions: ['Update'], subject: 'Course' }),
      ];

      const ability = factory.createForUser(groupRules, userRules);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Update', caslSubject('Course', {}))).toBe(false);
    });

    it('User Allow가 Group 정책에 추가된다', () => {
      const groupRules = [
        rule({ effect: Effect.ALLOW, actions: ['Read'], subject: 'Course' }),
      ];
      const userRules = [
        rule({ effect: Effect.ALLOW, actions: ['Update'], subject: 'Course' }),
      ];

      const ability = factory.createForUser(groupRules, userRules);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Update', caslSubject('Course', {}))).toBe(true);
    });

    it('resources가 특정 ID이면 해당 리소스만 허용한다', () => {
      const ability = factory.createForUser([
        rule({ resources: ['resource-1'] }),
      ]);

      expect(
        ability.can('Read', caslSubject('Course', { id: 'resource-1' })),
      ).toBe(true);
      expect(
        ability.can('Read', caslSubject('Course', { id: 'resource-2' })),
      ).toBe(false);
    });

    it('condition이 있으면 조건에 맞는 리소스만 허용한다', () => {
      const ability = factory.createForUser([
        rule({ condition: { spaceId: 'space-1' } }),
      ]);

      expect(
        ability.can('Read', caslSubject('Course', { spaceId: 'space-1' })),
      ).toBe(true);
      expect(
        ability.can('Read', caslSubject('Course', { spaceId: 'space-2' })),
      ).toBe(false);
    });

    it('subject가 *이면 all로 매핑된다', () => {
      const ability = factory.createForUser([
        rule({ subject: '*', actions: ['Read'] }),
      ]);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Read', caslSubject('Unit', {}))).toBe(true);
    });

    it('actions가 *이면 manage로 매핑된다', () => {
      const ability = factory.createForUser([
        rule({ actions: ['*'], subject: 'Course' }),
      ]);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Update', caslSubject('Course', {}))).toBe(true);
      expect(ability.can('Delete', caslSubject('Course', {}))).toBe(true);
    });

    it('빈 룰이면 모든 액션이 거부된다', () => {
      const ability = factory.createForUser([]);

      expect(ability.can('Read', caslSubject('Course', {}))).toBe(false);
    });
  });
});
