import { IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  storeId: string;

  @IsString()
  @MaxLength(50)
  name: string;
}
