import { MongoAbility, ForcedSubject } from '@casl/ability';

type AppSubjects = string | (ForcedSubject<string> & Record<string, any>);

export type AppAbility = MongoAbility<[string, AppSubjects]>;

export interface AccessControlContext {
  ability: AppAbility;
  userId: string;
  unitId: string;
  organizationId: string;
}
