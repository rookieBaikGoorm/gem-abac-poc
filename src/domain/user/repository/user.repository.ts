import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email });
  }

  async findByEmailExcludePassword(
    email: string,
  ): Promise<UserDocument | null> {
    return this.model.findOne({ email }).select({ password: 0 });
  }

  async create(data: {
    email: string;
    password: string;
    role: string;
    spaceId?: string;
  }): Promise<UserDocument> {
    return this.model.create(data);
  }
}
