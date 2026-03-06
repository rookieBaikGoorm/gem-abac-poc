import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './service';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { UpdateSubmissionDto } from './dtos/update-submission.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  AccessControlGuard,
  SubmissionAction,
  Subject,
} from '../../shared/access-control';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
@UseGuards(JwtAuthGuard, AccessControlGuard)
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: SubmissionAction.CREATE,
      subject: Subject.SUBMISSION,
    }),
  )
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: SubmissionAction.READ,
      subject: Subject.SUBMISSION,
    }),
  )
  findAll(@Query('spaceId') spaceId: string) {
    return this.submissionService.findAll(spaceId);
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.createForResource({
      action: SubmissionAction.READ,
      subject: Subject.SUBMISSION,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.createForResource({
      action: SubmissionAction.UPDATE,
      subject: Subject.SUBMISSION,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Patch(':id/toggle-login')
  @CheckPolicies(
    PolicyHandlerFactory.createForResource({
      action: SubmissionAction.TOGGLE_LOGIN,
      subject: Subject.SUBMISSION,
    }),
  )
  toggleLogin(@Param('id') id: string) {
    return this.submissionService.toggleLogin(id);
  }
}
