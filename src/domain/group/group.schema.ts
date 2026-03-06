import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PolicyRule, PolicyRuleSchema } from '../../shared/access-control';
import { GroupRole } from './constant';

export type GroupDocument = Group & Document;

/**
 * Group - Role 기반 기본 정책.
 * 기존 UserRole (MANAGER, GUEST 등) 의 기본 권한을 PolicyRule 배열로 관리한다.
 * RBAC -> ABAC 점진적 전환을 위한 브릿지 역할.
 */
@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, unique: true, enum: Object.values(GroupRole) })
  role: GroupRole;

  @Prop()
  description?: string;

  @Prop({ type: [PolicyRuleSchema], required: true, default: [] })
  policies: PolicyRule[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
