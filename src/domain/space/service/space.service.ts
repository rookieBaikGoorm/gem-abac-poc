import { Injectable } from '@nestjs/common';
import { SpaceDocument } from '../space.schema';
import { CreateSpaceDto } from '../dtos/create-space.dto';
import { UpdateSpaceDto } from '../dtos/update-space.dto';
import { SpaceRepository } from '../repository';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class SpaceService {
  constructor(
    private readonly spaceRepo: SpaceRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateSpaceDto): Promise<SpaceDocument> {
    this.accessControl.authorize('Create', 'Space');
    return this.spaceRepo.create(dto);
  }

  async findAll(): Promise<SpaceDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Space');
    return this.spaceRepo.findAll(filter ?? {});
  }

  async findOne(id: string): Promise<SpaceDocument> {
    const space = await this.spaceRepo.findById(id);
    this.accessControl.authorize('Read', 'Space', space.toObject());
    return space;
  }

  async update(id: string, dto: UpdateSpaceDto): Promise<SpaceDocument> {
    this.accessControl.authorize('Update', 'Space', { id });
    return this.spaceRepo.update(id, dto);
  }
}
