import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../course.schema';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { AccessControlService } from '../../../shared/access-control';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateCourseDto): Promise<CourseDocument> {
    this.accessControl.authorize('Create', 'Course');
    return this.courseModel.create(dto);
  }

  async findAll(spaceId: string): Promise<CourseDocument[]> {
    const filter = this.accessControl.getAccessibleQuery('Read', 'Course');
    return this.courseModel.find({ $and: [{ spaceId }, filter ?? {}] });
  }

  async findOne(id: string): Promise<CourseDocument> {
    this.accessControl.authorize('Read', 'Course', { id });
    return this.courseModel.findById(id).orFail();
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseDocument> {
    this.accessControl.authorize('Update', 'Course', { id });
    return this.courseModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }
}
