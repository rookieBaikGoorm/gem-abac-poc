import {
  Effect,
  Subject,
  SpaceAction,
  CourseAction,
  UnitAction,
  SubmissionAction,
  CrudAction,
  PolicyRule,
} from '../../shared/access-control';
import { GroupRole } from './constant/group-role.constant';

const allow = (
  subject: string,
  actions: string[],
  resources: string[] = ['*'],
): PolicyRule => ({
  effect: Effect.ALLOW,
  subject,
  actions,
  resources,
});

const deny = (
  subject: string,
  actions: string[],
  resources: string[] = ['*'],
): PolicyRule => ({
  effect: Effect.DENY,
  subject,
  actions,
  resources,
});

/**
 * SUPER_ADMIN - 전체 리소스에 대해 모든 권한
 */
export const SUPER_ADMIN_POLICIES: PolicyRule[] = [
  allow(Subject.ALL, [CrudAction.MANAGE]),
];

/**
 * MANAGER - Space 내 대부분의 리소스에 대해 CRUD + 도메인 액션 허용
 */
export const MANAGER_POLICIES: PolicyRule[] = [
  allow(Subject.SPACE, [
    SpaceAction.READ,
    SpaceAction.UPDATE,
    SpaceAction.INVITE,
  ]),
  allow(Subject.COURSE, [
    CourseAction.CREATE,
    CourseAction.READ,
    CourseAction.UPDATE,
    CourseAction.DELETE,
  ]),
  allow(Subject.UNIT, [
    UnitAction.CREATE,
    UnitAction.READ,
    UnitAction.UPDATE,
    UnitAction.DELETE,
    UnitAction.CLONE,
    UnitAction.LINK_SUBMISSION,
  ]),
  allow(Subject.SUBMISSION, [
    SubmissionAction.CREATE,
    SubmissionAction.READ,
    SubmissionAction.UPDATE,
    SubmissionAction.DELETE,
    SubmissionAction.TOGGLE_LOGIN,
  ]),
  allow(Subject.POLICY, [CrudAction.READ]),
  deny(Subject.SPACE, [SpaceAction.CREATE, SpaceAction.DELETE]),
];

/**
 * GUEST - 읽기 전용 + 제한된 Submission 접근
 */
export const GUEST_POLICIES: PolicyRule[] = [
  allow(Subject.SPACE, [SpaceAction.READ]),
  allow(Subject.COURSE, [CourseAction.READ]),
  allow(Subject.UNIT, [UnitAction.READ]),
  allow(Subject.SUBMISSION, [SubmissionAction.READ]),
];

export const GROUP_SEEDS = [
  {
    role: GroupRole.SUPER_ADMIN,
    description: '전체 리소스에 대한 모든 권한',
    policies: SUPER_ADMIN_POLICIES,
  },
  {
    role: GroupRole.MANAGER,
    description: 'Space 내 리소스 관리 권한',
    policies: MANAGER_POLICIES,
  },
  {
    role: GroupRole.GUEST,
    description: '읽기 전용 권한',
    policies: GUEST_POLICIES,
  },
];
