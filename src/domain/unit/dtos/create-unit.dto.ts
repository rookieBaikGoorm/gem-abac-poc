import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly courseId: string;

  @IsNotEmpty()
  @IsString()
  readonly spaceId: string;
}
