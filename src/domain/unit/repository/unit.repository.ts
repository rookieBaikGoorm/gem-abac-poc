import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Unit, UnitDocument } from '../unit.schema';
import { CreateUnitDto, UpdateUnitDto } from '../dtos';

@Injectable()
export class UnitRepository {
  constructor(
    @InjectModel(Unit.name)
    private readonly model: Model<UnitDocument>,
  ) {}

  async create(dto: CreateUnitDto): Promise<UnitDocument> {
    return this.model.create(dto);
  }

  async findAll(filter: FilterQuery<UnitDocument>): Promise<UnitDocument[]> {
    return this.model.find(filter);
  }

  async findById(id: string): Promise<UnitDocument> {
    return this.model.findById(id).orFail();
  }

  async update(id: string, dto: UpdateUnitDto): Promise<UnitDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }

  async updateField(
    id: string,
    field: Record<string, any>,
  ): Promise<UnitDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: field }, { new: true })
      .orFail();
  }
}
