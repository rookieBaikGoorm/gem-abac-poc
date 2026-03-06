import { Injectable } from '@nestjs/common';
import { CourseDocument } from '../course.schema';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { CourseRepository } from '../repository';
import {
  AccessControlService,
  CourseAction,
  Subject,
} from '../../../shared/access-control';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepository,
    private readonly accessControl: AccessControlService,
  ) {}

  async create(dto: CreateCourseDto): Promise<CourseDocument> {
    return this.courseRepo.create(dto);
  }

  async findAll(spaceId: string): Promise<CourseDocument[]> {
    const filter = this.accessControl.getAccessibleQuery({
      action: CourseAction.READ,
      subject: Subject.COURSE,
    });
    return this.courseRepo.findAll({ $and: [{ spaceId }, filter ?? {}] });
  }

  async findOne(id: string): Promise<CourseDocument> {
    const course = await this.courseRepo.findById(id);
    this.accessControl.authorize({
      action: CourseAction.READ,
      subject: Subject.COURSE,
      resource: course.toObject(),
    });
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseDocument> {
    const course = await this.courseRepo.findById(id);
    this.accessControl.authorize({
      action: CourseAction.UPDATE,
      subject: Subject.COURSE,
      resource: course.toObject(),
    });
    return this.courseRepo.update(id, dto);
  }
}
