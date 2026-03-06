import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isEmail } from 'class-validator';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    validate: [isEmail, 'Must be a valid email'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  spaceId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
