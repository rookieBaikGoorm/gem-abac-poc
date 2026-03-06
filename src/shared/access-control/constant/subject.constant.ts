export const Subject = {
  SPACE: 'Space',
  COURSE: 'Course',
  UNIT: 'Unit',
  SUBMISSION: 'Submission',
  USER: 'User',
  GROUP: 'Group',
  POLICY: 'Policy',
  ALL: 'all',
} as const;

export type Subject = (typeof Subject)[keyof typeof Subject];
