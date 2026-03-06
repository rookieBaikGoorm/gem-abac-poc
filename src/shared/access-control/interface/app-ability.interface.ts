import { MongoAbility, ForcedSubject } from '@casl/ability';
import { type Action } from '../constant/action.constant';
import { type Subject } from '../constant/subject.constant';

type AppSubjects = Subject | (ForcedSubject<Subject> & Record<string, any>);

export type AppAbility = MongoAbility<[Action, AppSubjects]>;

export interface AccessControlContext {
  ability: AppAbility;
  userId: string;
}
