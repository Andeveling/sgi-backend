import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}
