import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Space, SpaceDocument } from '../space.schema';
import { CreateSpaceDto, UpdateSpaceDto } from '../dtos';

@Injectable()
export class SpaceRepository {
  constructor(
    @InjectModel(Space.name)
    private readonly model: Model<SpaceDocument>,
  ) {}

  async create(dto: CreateSpaceDto): Promise<SpaceDocument> {
    return this.model.create(dto);
  }

  async findAll(filter: FilterQuery<SpaceDocument>): Promise<SpaceDocument[]> {
    return this.model.find(filter);
  }

  async findById(id: string): Promise<SpaceDocument> {
    return this.model.findById(id).orFail();
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<SpaceDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }
}
