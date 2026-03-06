import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CourseRepository } from './repository';
import { CourseService } from './service';
import { CourseController } from './course.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    AccessControlModule,
  ],
  controllers: [CourseController],
  providers: [CourseRepository, CourseService],
  exports: [CourseService, MongooseModule],
})
export class CourseModule {}
