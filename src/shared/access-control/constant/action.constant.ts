export const CrudAction = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete',
  /** CASL reserved keyword — 반드시 소문자 'manage' 사용. 모든 Action의 슈퍼셋으로 동작한다. */
  MANAGE: 'manage',
} as const;

export const SpaceAction = {
  ...CrudAction,
  INVITE: 'Invite',
} as const;

export const CourseAction = {
  ...CrudAction,
} as const;

export const UnitAction = {
  ...CrudAction,
  CLONE: 'Clone',
  LINK_SUBMISSION: 'LinkSubmission',
} as const;

export const SubmissionAction = {
  ...CrudAction,
  TOGGLE_LOGIN: 'ToggleLogin',
} as const;

export type Action =
  | (typeof SpaceAction)[keyof typeof SpaceAction]
  | (typeof CourseAction)[keyof typeof CourseAction]
  | (typeof UnitAction)[keyof typeof UnitAction]
  | (typeof SubmissionAction)[keyof typeof SubmissionAction];
