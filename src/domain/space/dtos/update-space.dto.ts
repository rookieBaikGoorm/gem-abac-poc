import { IsOptional, IsString } from 'class-validator';

export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
