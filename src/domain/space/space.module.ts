import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Space, SpaceSchema } from './space.schema';
import { SpaceRepository } from './repository';
import { SpaceService } from './service';
import { SpaceController } from './space.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
    AccessControlModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceRepository, SpaceService],
  exports: [SpaceService, MongooseModule],
})
export class SpaceModule {}
