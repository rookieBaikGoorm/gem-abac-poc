import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from '../unit.schema';
import { CreateUnitDto } from '../dtos/create-unit.dto';
import { UpdateUnitDto } from '../dtos/update-unit.dto';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel(Unit.name) private readonly unitModel: Model<UnitDocument>,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateUnitDto): Promise<UnitDocument> {
    this.accessControl.authorize('Create', 'Unit');
    return this.unitModel.create(dto);
  }

  async findAll(spaceId: string): Promise<UnitDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Unit');
    return this.unitModel.find({
      $and: [{ spaceId }, filter ?? {}],
    });
  }

  async findOne(id: string): Promise<UnitDocument> {
    this.accessControl.authorize('Read', 'Unit', { id });
    return this.unitModel.findById(id).orFail();
  }

  async update(id: string, dto: UpdateUnitDto): Promise<UnitDocument> {
    this.accessControl.authorize('Update', 'Unit', { id });
    return this.unitModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }

  async clone(id: string): Promise<UnitDocument> {
    this.accessControl.authorize('Clone', 'Unit', { id });
    const original = await this.unitModel.findById(id).orFail();
    const { id: _, ...data } = original.toObject();
    return this.unitModel.create({
      ...data,
      name: `${data.name} (copy)`,
    });
  }

  async linkSubmission(
    id: string,
    submissionId: string,
  ): Promise<UnitDocument> {
    this.accessControl.authorize('LinkSubmission', 'Unit', { id });
    return this.unitModel
      .findByIdAndUpdate(id, { $set: { submissionId } }, { new: true })
      .orFail();
  }
}
