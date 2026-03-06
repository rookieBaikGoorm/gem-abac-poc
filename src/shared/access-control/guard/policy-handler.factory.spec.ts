import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { PolicyHandlerFactory } from './policy-handler.factory';
import { AppAbility } from '../interface';
import { CourseAction } from '../constant/action.constant';
import { Subject } from '../constant/subject.constant';

function buildAbility(
  setup: (builder: AbilityBuilder<AppAbility>) => void,
): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
  setup(builder);
  return builder.build();
}

describe('PolicyHandlerFactory', () => {
  describe('create', () => {
    it('해당 action+subject 룰이 있으면 true를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.create({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(true);
    });

    it('다른 subject의 룰만 있으면 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Unit');
      });

      const handler = PolicyHandlerFactory.create({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });

    it('다른 action의 룰만 있으면 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.create({
        action: CourseAction.UPDATE,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });

    it('conditions가 있는 룰도 존재 여부만 확인한다 (true)', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course', { spaceId: 'space-1' } as any);
      });

      const handler = PolicyHandlerFactory.create({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      // subject string으로 체크하므로 conditions는 무시됨
      expect(handler.handle(ability)).toBe(true);
    });

    it('빈 ability이면 false를 반환한다', () => {
      const ability = buildAbility(() => {});

      const handler = PolicyHandlerFactory.create({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });
  });
});
