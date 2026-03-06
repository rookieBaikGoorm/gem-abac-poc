export const CrudAction = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete',
  MANAGE: 'Manage',
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
