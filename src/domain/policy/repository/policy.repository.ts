import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument } from '../policy.schema';
import { UpsertPolicyDto } from '../dtos';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectModel(Policy.name)
    private readonly model: Model<PolicyDocument>,
  ) {}

  async findByUserAndSpace(
    userId: string,
    spaceId: string,
  ): Promise<Policy | null> {
    return this.model.findOne({ userId, spaceId });
  }

  async upsert(dto: UpsertPolicyDto): Promise<Policy> {
    return this.model.findOneAndUpdate(
      { userId: dto.userId, spaceId: dto.spaceId },
      { $set: { rules: dto.rules } },
      { upsert: true, new: true },
    );
  }

  async remove(userId: string, spaceId: string): Promise<void> {
    await this.model.deleteOne({ userId, spaceId });
  }
}
