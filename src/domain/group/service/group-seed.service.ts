import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../group.schema';
import { GROUP_SEEDS } from '../constant';

@Injectable()
export class GroupSeedService implements OnModuleInit {
  private readonly logger = new Logger(GroupSeedService.name);

  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {}

  async onModuleInit() {
    for (const seed of GROUP_SEEDS) {
      const exists = await this.groupModel.exists({ role: seed.role });
      if (!exists) {
        await this.groupModel.create(seed);
        this.logger.log(`Seeded group: ${seed.role}`);
      }
    }
  }
}
