import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './service';
import { CreateSpaceDto } from './dtos/create-space.dto';
import { UpdateSpaceDto } from './dtos/update-space.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  AccessControlGuard,
  SpaceAction,
  Subject,
} from '../../shared/access-control';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('spaces')
@UseGuards(JwtAuthGuard, AccessControlGuard)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: SpaceAction.CREATE,
      subject: Subject.SPACE,
    }),
  )
  create(@Body() dto: CreateSpaceDto) {
    return this.spaceService.create(dto);
  }

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
    }),
  )
  findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  @CheckPolicies(
    PolicyHandlerFactory.createForResource({
      action: SpaceAction.READ,
      subject: Subject.SPACE,
    }),
  )
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(
    PolicyHandlerFactory.createForResource({
      action: SpaceAction.UPDATE,
      subject: Subject.SPACE,
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spaceService.update(id, dto);
  }
}
