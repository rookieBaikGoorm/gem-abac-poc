import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, UnitSchema } from './unit.schema';
import { UnitService } from './service';
import { UnitController } from './unit.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
    AccessControlModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, MongooseModule],
})
export class UnitModule {}
