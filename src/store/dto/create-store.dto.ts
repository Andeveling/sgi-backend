import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsPhoneNumber(null) // Valida que el teléfono sea un número de teléfono válido
  cellphone: string;
}
