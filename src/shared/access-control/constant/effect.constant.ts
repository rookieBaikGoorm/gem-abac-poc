export const Effect = {
  ALLOW: 'Allow',
  DENY: 'Deny',
} as const;

export type Effect = (typeof Effect)[keyof typeof Effect];
