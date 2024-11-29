import { IsString, MaxLength, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  storeId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}
