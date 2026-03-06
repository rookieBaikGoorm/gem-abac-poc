import { Injectable } from '@nestjs/common';
import { SpaceDocument } from '../space.schema';
import { CreateSpaceDto } from '../dtos/create-space.dto';
import { UpdateSpaceDto } from '../dtos/update-space.dto';
import { SpaceRepository } from '../repository';
import {
  AccessControlService,
  SpaceAction,
  Subject,
} from '../../../shared/access-control';

@Injectable()
export class SpaceService {
  constructor(
    private readonly spaceRepo: SpaceRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateSpaceDto): Promise<SpaceDocument> {
    return this.spaceRepo.create(dto);
  }

  async findAll(): Promise<SpaceDocument[]> {
    const filter = this.accessControl.getAccessibleQuery({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
    });
    return this.spaceRepo.findAll(filter ?? {});
  }

  async findOne(id: string): Promise<SpaceDocument> {
    const space = await this.spaceRepo.findById(id);
    this.accessControl.authorize({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
      resource: space.toObject(),
    });
    return space;
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<SpaceDocument> {
    const space = await this.spaceRepo.findById(id);
    this.accessControl.authorize({
      action: SpaceAction.UPDATE,
      subject: Subject.SPACE,
      resource: space.toObject(),
    });
    return this.spaceRepo.update(id, dto);
  }
}
