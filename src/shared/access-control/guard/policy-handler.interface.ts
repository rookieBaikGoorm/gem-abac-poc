import { AppAbility } from '../interface';

export interface PolicyHandler {
  handle(ability: AppAbility, params?: Record<string, string>): boolean;
}
