import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PolicyService } from './service';
import { UpsertPolicyDto } from './dtos/upsert-policy.dto';
import {
  CheckPolicies,
  PolicyHandlerFactory,
  AccessControlGuard,
  CrudAction,
  Subject,
} from '../../shared/access-control';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('policies')
@UseGuards(JwtAuthGuard, AccessControlGuard)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: CrudAction.READ,
      subject: Subject.POLICY,
    }),
  )
  findByUser(
    @Query('userId') userId: string,
    @Query('spaceId') spaceId: string,
  ) {
    return this.policyService.findByUser(userId, spaceId);
  }

  @Post()
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: CrudAction.UPDATE,
      subject: Subject.POLICY,
    }),
  )
  upsert(@Body() dto: UpsertPolicyDto) {
    return this.policyService.upsert(dto);
  }

  @Delete(':userId/:spaceId')
  @CheckPolicies(
    PolicyHandlerFactory.createForScope({
      action: CrudAction.DELETE,
      subject: Subject.POLICY,
    }),
  )
  remove(@Param('userId') userId: string, @Param('spaceId') spaceId: string) {
    return this.policyService.remove(userId, spaceId);
  }
}
