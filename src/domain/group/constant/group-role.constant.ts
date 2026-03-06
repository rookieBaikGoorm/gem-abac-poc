export const GroupRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MANAGER: 'MANAGER',
  GUEST: 'GUEST',
} as const;

export type GroupRole = (typeof GroupRole)[keyof typeof GroupRole];
