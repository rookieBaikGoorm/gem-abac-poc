import { Schema } from 'mongoose';

export const PolicyRuleSchema = new Schema(
  {
    effect: { type: String, required: true, enum: ['Allow', 'Deny'] },
    subject: { type: String, required: true },
    actions: { type: [String], required: true },
    resources: { type: [String], required: true },
    condition: { type: Schema.Types.Mixed },
  },
  { _id: false },
);
