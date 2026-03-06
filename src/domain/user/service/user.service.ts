import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      return match ? { ...user.toObject(), password: null } : null;
    }
    return null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select({ password: 0 });
  }

  async create(
    email: string,
    password: string,
    role: string,
    spaceId?: string,
  ): Promise<UserDocument> {
    const hash = await bcrypt.hash(password, 10);
    return this.userModel.create({ email, password: hash, role, spaceId });
  }
}
