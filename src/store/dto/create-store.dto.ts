import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsPhoneNumber(null)
  cellphone: string;

  @IsString()
  address: string;
}
