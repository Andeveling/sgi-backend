import { IsString, MaxLength, IsUUID, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  storeId: string;

  @IsString()
  @MinLength(3)  
  @MaxLength(50)
  @IsNotEmpty()  
  name: string;
}
