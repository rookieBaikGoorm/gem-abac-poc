import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { User } from '../user.schema';
import { UserRepository } from '../repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepo.findByEmail(email);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      return match ? { ...user.toObject(), password: null } : null;
    }
    return null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmailExcludePassword(email);
  }

  async create(
    email: string,
    password: string,
    role: string,
    spaceId?: string,
  ) {
    const hash = await bcrypt.hash(password, 10);
    return this.userRepo.create({ email, password: hash, role, spaceId });
  }
}
