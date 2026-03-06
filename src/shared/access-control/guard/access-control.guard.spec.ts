import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { AccessControlGuard } from './access-control.guard';
import { AppAbility } from '../interface';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard;
  let reflector: Reflector;
  let clsService: { get: jest.Mock };

  beforeEach(() => {
    reflector = new Reflector();
    clsService = { get: jest.fn() };
    guard = new AccessControlGuard(reflector, clsService as any);
  });

  const mockContext = (params: Record<string, string> = {}): ExecutionContext =>
    ({
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ params }),
      }),
    }) as any;

  const buildAbility = (
    setup: (builder: AbilityBuilder<AppAbility>) => void,
  ): AppAbility => {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
    setup(builder);
    return builder.build();
  };

  it('Public 라우트는 항상 true를 반환한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('핸들러가 없으면 true를 반환한다 (opt-in)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('ability가 없으면 false를 반환한다', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([{ handle: jest.fn().mockReturnValue(true) }]);
    clsService.get.mockReturnValue(undefined);

    expect(guard.canActivate(mockContext())).toBe(false);
  });

  it('모든 핸들러가 통과하면 true를 반환한다', () => {
    const ability = buildAbility(({ can }) => {
      can('Read', 'Course');
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([{ handle: jest.fn().mockReturnValue(true) }]);
    clsService.get.mockReturnValue(ability);

    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('하나라도 실패하면 false를 반환한다', () => {
    const ability = buildAbility(({ can }) => {
      can('Read', 'Course');
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(reflector, 'get')
      .mockReturnValue([
        { handle: jest.fn().mockReturnValue(true) },
        { handle: jest.fn().mockReturnValue(false) },
      ]);
    clsService.get.mockReturnValue(ability);

    expect(guard.canActivate(mockContext())).toBe(false);
  });

  it('핸들러에 request params를 전달한다', () => {
    const ability = buildAbility(({ can }) => {
      can('Read', 'Course');
    });
    const handleFn = jest.fn().mockReturnValue(true);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(reflector, 'get').mockReturnValue([{ handle: handleFn }]);
    clsService.get.mockReturnValue(ability);

    guard.canActivate(mockContext({ id: 'course-1' }));

    expect(handleFn).toHaveBeenCalledWith(ability, { id: 'course-1' });
  });
});
