import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CourseService } from './service';
import { CourseController } from './course.controller';
import { AccessControlModule } from '../../shared/access-control';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    AccessControlModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService, MongooseModule],
})
export class CourseModule {}
