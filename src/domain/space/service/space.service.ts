import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from '../space.schema';
import { CreateSpaceDto } from '../dtos/create-space.dto';
import { UpdateSpaceDto } from '../dtos/update-space.dto';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(Space.name) private readonly spaceModel: Model<SpaceDocument>,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateSpaceDto): Promise<SpaceDocument> {
    this.accessControl.authorize('Create', 'Space');
    return this.spaceModel.create(dto);
  }

  async findAll(): Promise<SpaceDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Space');
    return this.spaceModel.find({ $and: [filter ?? {}] });
  }

  async findOne(id: string): Promise<SpaceDocument> {
    this.accessControl.authorize('Read', 'Space', { id });
    return this.spaceModel.findById(id).orFail();
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<SpaceDocument> {
    this.accessControl.authorize('Update', 'Space', { id });
    return this.spaceModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }
}
