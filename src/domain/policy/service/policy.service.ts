import { Injectable } from '@nestjs/common';
import { Policy } from '../policy.schema';
import { UpsertPolicyDto } from '../dtos/upsert-policy.dto';
import { PolicyRepository } from '../repository';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class PolicyService {
  constructor(
    private readonly policyRepo: PolicyRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async findByUser(userId: string, spaceId: string): Promise<Policy | null> {
    this.accessControl.authorize('Read', 'Policy');
    return this.policyRepo.findByUserAndSpace(userId, spaceId);
  }

  async upsert(dto: UpsertPolicyDto): Promise<Policy> {
    this.accessControl.authorize('Update', 'Policy');
    return this.policyRepo.upsert(dto);
  }

  async remove(userId: string, spaceId: string): Promise<void> {
    this.accessControl.authorize('Delete', 'Policy');
    return this.policyRepo.remove(userId, spaceId);
  }
}
