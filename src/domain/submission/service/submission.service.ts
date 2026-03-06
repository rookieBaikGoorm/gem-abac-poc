import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from '../submission.schema';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { UpdateSubmissionDto } from '../dtos/update-submission.dto';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<SubmissionDocument>,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<SubmissionDocument> {
    this.accessControl.authorize('Create', 'Submission');
    return this.submissionModel.create(dto);
  }

  async findAll(spaceId: string): Promise<SubmissionDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Submission');
    return this.submissionModel.find({ $and: [{ spaceId }, filter ?? {}] });
  }

  async findOne(id: string): Promise<SubmissionDocument> {
    this.accessControl.authorize('Read', 'Submission', { id });
    return this.submissionModel.findById(id).orFail();
  }

  async update(
    id: string,
    dto: UpdateSubmissionDto,
  ): Promise<SubmissionDocument> {
    this.accessControl.authorize('Update', 'Submission', { id });
    return this.submissionModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }

  async toggleLogin(id: string): Promise<SubmissionDocument> {
    this.accessControl.authorize('ToggleLogin', 'Submission', { id });
    const doc = await this.submissionModel.findById(id).orFail();
    return this.submissionModel
      .findByIdAndUpdate(
        id,
        { $set: { loginRequired: !doc.loginRequired } },
        { new: true },
      )
      .orFail();
  }
}
