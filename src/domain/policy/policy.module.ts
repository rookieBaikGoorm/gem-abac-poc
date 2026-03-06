import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Policy, PolicySchema } from './policy.schema';
import { PolicyRepository } from './repository';
import { PolicyService } from './service';
import { PolicyController } from './policy.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }]),
    AccessControlModule,
  ],
  controllers: [PolicyController],
  providers: [PolicyRepository, PolicyService],
  exports: [PolicyService, MongooseModule],
})
export class PolicyModule {}
