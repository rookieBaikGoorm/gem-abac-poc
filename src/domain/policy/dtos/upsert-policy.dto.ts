import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Effect } from '../../../shared/access-control';

class PolicyRuleDto {
  @IsEnum([Effect.ALLOW, Effect.DENY])
  readonly effect: string;

  @IsNotEmpty()
  @IsString()
  readonly subject: string;

  @IsArray()
  @IsString({ each: true })
  readonly actions: string[];

  @IsArray()
  @IsString({ each: true })
  readonly resources: string[];

  @IsOptional()
  readonly condition?: Record<string, any>;
}

export class UpsertPolicyDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly spaceId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyRuleDto)
  readonly rules: PolicyRuleDto[];
}
