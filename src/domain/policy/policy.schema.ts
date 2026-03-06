import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PolicyRule, PolicyRuleSchema } from '../../shared/access-control';

export type PolicyDocument = Policy & Document;

/**
 * Policy - 유저별 세부 정책.
 * (userId, spaceId) 1:1 매핑되는 유저별 세부 접근 정책 문서.
 * Group 기본 정책 위에 추가 허용/제한을 적용할 때 사용한다.
 */
@Schema({ timestamps: true })
export class Policy {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  spaceId: string;

  @Prop({ type: [PolicyRuleSchema], required: true, default: [] })
  rules: PolicyRule[];
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
PolicySchema.index({ userId: 1, spaceId: 1 }, { unique: true });
