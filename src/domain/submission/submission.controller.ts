import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubmissionService } from './service';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { UpdateSubmissionDto } from './dtos/update-submission.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  SubmissionAction,
  Subject,
} from '../../shared/access-control';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SubmissionAction.CREATE,
      subject: Subject.SUBMISSION,
    }),
  )
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SubmissionAction.READ,
      subject: Subject.SUBMISSION,
    }),
  )
  findAll(@Query('spaceId') spaceId: string) {
    return this.submissionService.findAll(spaceId);
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SubmissionAction.READ,
      subject: Subject.SUBMISSION,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SubmissionAction.UPDATE,
      subject: Subject.SUBMISSION,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Patch(':id/toggle-login')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SubmissionAction.TOGGLE_LOGIN,
      subject: Subject.SUBMISSION,
    }),
  )
  toggleLogin(@Param('id') id: string) {
    return this.submissionService.toggleLogin(id);
  }
}
