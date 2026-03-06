export const Subject = {
  SPACE: 'Space',
  COURSE: 'Course',
  UNIT: 'Unit',
  SUBMISSION: 'Submission',
  USER: 'User',
  GROUP: 'Group',
  POLICY: 'Policy',
  /** CASL reserved keyword — 반드시 소문자 'all' 사용. 모든 Subject의 와일드카드로 동작한다. */
  ALL: 'all',
} as const;

export type Subject = (typeof Subject)[keyof typeof Subject];
