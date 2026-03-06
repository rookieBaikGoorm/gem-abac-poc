import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Submission, SubmissionDocument } from '../submission.schema';
import { CreateSubmissionDto, UpdateSubmissionDto } from '../dtos';

@Injectable()
export class SubmissionRepository {
  constructor(
    @InjectModel(Submission.name)
    private readonly model: Model<SubmissionDocument>,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<SubmissionDocument> {
    return this.model.create(dto);
  }

  async findAll(
    filter: FilterQuery<SubmissionDocument>,
  ): Promise<SubmissionDocument[]> {
    return this.model.find(filter);
  }

  async findById(id: string): Promise<SubmissionDocument> {
    return this.model.findById(id).orFail();
  }

  async update(
    id: string,
    dto: UpdateSubmissionDto,
  ): Promise<SubmissionDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }

  async updateField(
    id: string,
    field: Record<string, any>,
  ): Promise<SubmissionDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: field }, { new: true })
      .orFail();
  }
}
