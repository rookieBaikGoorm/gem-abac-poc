export { AccessControlModule } from './access-control.module';
export { AccessControlService } from './service';
export { CaslAbilityFactory } from './factory';
export {
  AccessControlGuard,
  CheckPolicies,
  PolicyHandlerFactory,
  type PolicyHandler,
} from './guard';
export {
  Effect,
  Subject,
  CrudAction,
  SpaceAction,
  CourseAction,
  UnitAction,
  SubmissionAction,
  type Action,
} from './constant';
export {
  PolicyRuleSchema,
  type PolicyRule,
  type AppAbility,
  type AccessControlContext,
} from './interface';
