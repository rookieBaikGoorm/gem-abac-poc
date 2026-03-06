import { Effect } from '../constant';

export interface PolicyRule {
  effect: Effect;
  subject: string;
  actions: string[];
  resources: string[];
  condition?: Record<string, any>;
}
