import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SpaceService } from './service';
import { CreateSpaceDto } from './dtos/create-space.dto';
import { UpdateSpaceDto } from './dtos/update-space.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  SpaceAction,
  Subject,
} from '../../shared/access-control';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SpaceAction.CREATE,
      subject: Subject.SPACE,
    }),
  )
  create(@Body() dto: CreateSpaceDto) {
    return this.spaceService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
    }),
  )
  findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.create({
      action: SpaceAction.UPDATE,
      subject: Subject.SPACE,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spaceService.update(id, dto);
  }
}
