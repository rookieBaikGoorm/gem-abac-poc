import { Injectable } from '@nestjs/common';
import { UnitDocument } from '../unit.schema';
import { CreateUnitDto } from '../dtos/create-unit.dto';
import { UpdateUnitDto } from '../dtos/update-unit.dto';
import { UnitRepository } from '../repository';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepo: UnitRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateUnitDto): Promise<UnitDocument> {
    this.accessControl.authorize('Create', 'Unit');
    return this.unitRepo.create(dto);
  }

  async findAll(spaceId: string): Promise<UnitDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Unit');
    return this.unitRepo.findAll({ $and: [{ spaceId }, filter ?? {}] });
  }

  async findOne(id: string): Promise<UnitDocument> {
    const unit = await this.unitRepo.findById(id);
    this.accessControl.authorize('Read', 'Unit', unit.toObject());
    return unit;
  }

  async update(id: string, dto: UpdateUnitDto): Promise<UnitDocument> {
    this.accessControl.authorize('Update', 'Unit', { id });
    return this.unitRepo.update(id, dto);
  }

  async clone(id: string): Promise<UnitDocument> {
    this.accessControl.authorize('Clone', 'Unit', { id });
    const original = await this.unitRepo.findById(id);
    const { id: _, ...data } = original.toObject();
    return this.unitRepo.create({
      ...data,
      name: `${data.name} (copy)`,
    } as CreateUnitDto);
  }

  async linkSubmission(
    id: string,
    submissionId: string,
  ): Promise<UnitDocument> {
    this.accessControl.authorize('LinkSubmission', 'Unit', { id });
    return this.unitRepo.updateField(id, { submissionId });
  }
}
