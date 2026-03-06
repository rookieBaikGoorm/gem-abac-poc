import { Injectable } from '@nestjs/common';
import { Policy } from '../policy.schema';
import { UpsertPolicyDto } from '../dtos/upsert-policy.dto';
import { PolicyRepository } from '../repository';

@Injectable()
export class PolicyService {
  constructor(private readonly policyRepo: PolicyRepository) {}

  async findByUser(userId: string, spaceId: string): Promise<Policy | null> {
    return this.policyRepo.findByUserAndSpace(userId, spaceId);
  }

  async upsert(dto: UpsertPolicyDto): Promise<Policy> {
    return this.policyRepo.upsert(dto);
  }

  async remove(userId: string, spaceId: string): Promise<void> {
    return this.policyRepo.remove(userId, spaceId);
  }
}
