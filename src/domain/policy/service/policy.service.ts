import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyDocument } from '../policy.schema';
import { UpsertPolicyDto } from '../dtos/upsert-policy.dto';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class PolicyService {
  constructor(
    @InjectModel(Policy.name)
    private readonly policyModel: Model<PolicyDocument>,
    private readonly accessControl: AccessControlService,
  ) {}

  async findByUser(userId: string, spaceId: string): Promise<Policy | null> {
    this.accessControl.authorize('Read', 'Policy');
    return this.policyModel.findOne({ userId, spaceId });
  }

  async upsert(dto: UpsertPolicyDto): Promise<Policy> {
    this.accessControl.authorize('Update', 'Policy');
    return this.policyModel.findOneAndUpdate(
      { userId: dto.userId, spaceId: dto.spaceId },
      { $set: { rules: dto.rules } },
      { upsert: true, new: true },
    );
  }

  async remove(userId: string, spaceId: string): Promise<void> {
    this.accessControl.authorize('Delete', 'Policy');
    await this.policyModel.deleteOne({ userId, spaceId });
  }
}
