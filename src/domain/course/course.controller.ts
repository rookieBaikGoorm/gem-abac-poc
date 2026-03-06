import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CourseService } from './service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  CourseAction,
  Subject,
} from '../../shared/access-control';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: CourseAction.CREATE,
      subject: Subject.COURSE,
    }),
  )
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: CourseAction.READ,
      subject: Subject.COURSE,
    }),
  )
  findAll(@Query('spaceId') spaceId: string) {
    return this.courseService.findAll(spaceId);
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: CourseAction.READ,
      subject: Subject.COURSE,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: CourseAction.UPDATE,
      subject: Subject.COURSE,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }
}
