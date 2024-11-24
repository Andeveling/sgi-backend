import { Type } from 'class-transformer';
import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // Permitir hasta 2 decimales
  @Type(() => Number) // Transforma el valor a un número
  price: number;

  @IsInt()
  @Type(() => Number)
  quantity: number;
}
