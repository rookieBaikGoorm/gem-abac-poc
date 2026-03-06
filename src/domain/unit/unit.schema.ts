import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({ timestamps: true })
export class Unit {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, index: true })
  courseId: string;

  @Prop({ required: true, index: true })
  spaceId: string;

  @Prop({ index: true })
  submissionId?: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
