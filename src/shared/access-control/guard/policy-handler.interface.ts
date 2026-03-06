import { AppAbility } from '../interface';

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}
