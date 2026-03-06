import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ index: true })
  unitId?: string;

  @Prop({ required: true, index: true })
  spaceId: string;

  @Prop({ default: false })
  loginRequired: boolean;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
