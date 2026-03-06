import { Injectable } from '@nestjs/common';
import { UnitDocument } from '../unit.schema';
import { CreateUnitDto } from '../dtos/create-unit.dto';
import { UpdateUnitDto } from '../dtos/update-unit.dto';
import { UnitRepository } from '../repository';
import {
  AccessControlService,
  UnitAction,
  Subject,
} from '../../../shared/access-control';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepo: UnitRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateUnitDto): Promise<UnitDocument> {
    return this.unitRepo.create(dto);
  }

  async findAll(spaceId: string): Promise<UnitDocument[]> {
    const filter = this.accessControl.getAccessibleQuery({
      action: UnitAction.READ,
      subject: Subject.UNIT,
    });
    return this.unitRepo.findAll({ $and: [{ spaceId }, filter ?? {}] });
  }

  async findOne(id: string): Promise<UnitDocument> {
    const unit = await this.unitRepo.findById(id);
    this.accessControl.authorize({
      action: UnitAction.READ,
      subject: Subject.UNIT,
      resource: unit.toObject(),
    });
    return unit;
  }

  async update(id: string, dto: UpdateUnitDto): Promise<UnitDocument> {
    const unit = await this.unitRepo.findById(id);
    this.accessControl.authorize({
      action: UnitAction.UPDATE,
      subject: Subject.UNIT,
      resource: unit.toObject(),
    });
    return this.unitRepo.update(id, dto);
  }

  async clone(id: string): Promise<UnitDocument> {
    const original = await this.unitRepo.findById(id);
    this.accessControl.authorize({
      action: UnitAction.CLONE,
      subject: Subject.UNIT,
      resource: original.toObject(),
    });
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
    const unit = await this.unitRepo.findById(id);
    this.accessControl.authorize({
      action: UnitAction.LINK_SUBMISSION,
      subject: Subject.UNIT,
      resource: unit.toObject(),
    });
    return this.unitRepo.updateField(id, { submissionId });
  }
}
