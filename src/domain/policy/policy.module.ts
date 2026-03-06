import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Policy, PolicySchema } from './policy.schema';
import { PolicyRepository } from './repository';
import { PolicyService } from './service';
import { PolicyController } from './policy.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }]),
  ],
  controllers: [PolicyController],
  providers: [PolicyRepository, PolicyService],
  exports: [PolicyService, MongooseModule],
})
export class PolicyModule {}
