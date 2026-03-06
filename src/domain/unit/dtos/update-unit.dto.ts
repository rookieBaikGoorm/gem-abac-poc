import { IsOptional, IsString } from 'class-validator';

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
