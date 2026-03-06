import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UnitService } from './service';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { UpdateUnitDto } from './dtos/update-unit.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  UnitAction,
  Subject,
} from '../../shared/access-control';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.CREATE,
      subject: Subject.UNIT,
    }),
  )
  create(@Body() dto: CreateUnitDto) {
    return this.unitService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.READ,
      subject: Subject.UNIT,
    }),
  )
  findAll(@Query('spaceId') spaceId: string) {
    return this.unitService.findAll(spaceId);
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.READ,
      subject: Subject.UNIT,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.UPDATE,
      subject: Subject.UNIT,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitService.update(id, dto);
  }

  @Post(':id/clone')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.CLONE,
      subject: Subject.UNIT,
    }),
  )
  clone(@Param('id') id: string) {
    return this.unitService.clone(id);
  }

  @Patch(':id/submission/:submissionId')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: UnitAction.LINK_SUBMISSION,
      subject: Subject.UNIT,
    }),
  )
  linkSubmission(
    @Param('id') id: string,
    @Param('submissionId') submissionId: string,
  ) {
    return this.unitService.linkSubmission(id, submissionId);
  }
}
