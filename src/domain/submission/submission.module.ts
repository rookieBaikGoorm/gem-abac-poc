import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './submission.schema';
import { SubmissionRepository } from './repository';
import { SubmissionService } from './service';
import { SubmissionController } from './submission.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AccessControlModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionRepository, SubmissionService],
  exports: [SubmissionService, MongooseModule],
})
export class SubmissionModule {}
