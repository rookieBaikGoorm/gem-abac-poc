import { Injectable } from '@nestjs/common';
import { SubmissionDocument } from '../submission.schema';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { UpdateSubmissionDto } from '../dtos/update-submission.dto';
import { SubmissionRepository } from '../repository';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepo: SubmissionRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<SubmissionDocument> {
    return this.submissionRepo.create(dto);
  }

  async findAll(spaceId: string): Promise<SubmissionDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Submission');
    return this.submissionRepo.findAll({
      $and: [{ spaceId }, filter ?? {}],
    });
  }

  async findOne(id: string): Promise<SubmissionDocument> {
    const submission = await this.submissionRepo.findById(id);
    this.accessControl.authorize('Read', 'Submission', submission.toObject());
    return submission;
  }

  async update(
    id: string,
    dto: UpdateSubmissionDto,
  ): Promise<SubmissionDocument> {
    const submission = await this.submissionRepo.findById(id);
    this.accessControl.authorize('Update', 'Submission', submission.toObject());
    return this.submissionRepo.update(id, dto);
  }

  async toggleLogin(id: string): Promise<SubmissionDocument> {
    const submission = await this.submissionRepo.findById(id);
    this.accessControl.authorize(
      'ToggleLogin',
      'Submission',
      submission.toObject(),
    );
    return this.submissionRepo.updateField(id, {
      loginRequired: !submission.loginRequired,
    });
  }
}
