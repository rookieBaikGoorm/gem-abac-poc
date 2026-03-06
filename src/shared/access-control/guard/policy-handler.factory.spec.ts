import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { PolicyHandlerFactory } from './policy-handler.factory';
import { AppAbility } from '../interface';
import { CourseAction, UnitAction } from '../constant/action.constant';
import { Subject } from '../constant/subject.constant';

function buildAbility(
  setup: (builder: AbilityBuilder<AppAbility>) => void,
): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
  setup(builder);
  return builder.build();
}

describe('PolicyHandlerFactory', () => {
  describe('createForScope', () => {
    it('해당 scope 권한이 있으면 true를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.createForScope({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(true);
    });

    it('해당 scope 권한이 없으면 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Unit');
      });

      const handler = PolicyHandlerFactory.createForScope({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });

    it('다른 액션에 대해서는 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.createForScope({
        action: CourseAction.UPDATE,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });
  });

  describe('createForResource', () => {
    it('리소스 ID가 있고 권한이 있으면 true를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.createForResource({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability, { id: 'course-1' })).toBe(true);
    });

    it('params가 없으면 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.createForResource({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability)).toBe(false);
    });

    it('param에 해당하는 키가 없으면 false를 반환한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course');
      });

      const handler = PolicyHandlerFactory.createForResource({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability, { otherId: 'course-1' })).toBe(false);
    });

    it('커스텀 param 키를 사용할 수 있다', () => {
      const ability = buildAbility(({ can }) => {
        can('Clone', 'Unit');
      });

      const handler = PolicyHandlerFactory.createForResource({
        action: UnitAction.CLONE,
        subject: Subject.UNIT,
        param: 'unitId',
      });

      expect(handler.handle(ability, { unitId: 'unit-1' })).toBe(true);
      expect(handler.handle(ability, { id: 'unit-1' })).toBe(false);
    });

    it('특정 리소스에만 권한이 있으면 해당 ID만 허용한다', () => {
      const ability = buildAbility(({ can }) => {
        can('Read', 'Course', { id: { $in: ['course-1'] } } as any);
      });

      const handler = PolicyHandlerFactory.createForResource({
        action: CourseAction.READ,
        subject: Subject.COURSE,
      });

      expect(handler.handle(ability, { id: 'course-1' })).toBe(true);
      expect(handler.handle(ability, { id: 'course-2' })).toBe(false);
    });
  });
});
