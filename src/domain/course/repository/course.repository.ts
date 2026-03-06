import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Course, CourseDocument } from '../course.schema';
import { CreateCourseDto, UpdateCourseDto } from '../dtos';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectModel(Course.name)
    private readonly model: Model<CourseDocument>,
  ) {}

  async create(dto: CreateCourseDto): Promise<CourseDocument> {
    return this.model.create(dto);
  }

  async findAll(
    filter: FilterQuery<CourseDocument>,
  ): Promise<CourseDocument[]> {
    return this.model.find(filter);
  }

  async findById(id: string): Promise<CourseDocument> {
    return this.model.findById(id).orFail();
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseDocument> {
    return this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .orFail();
  }
}
