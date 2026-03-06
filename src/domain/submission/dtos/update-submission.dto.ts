import { IsOptional, IsString } from 'class-validator';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
