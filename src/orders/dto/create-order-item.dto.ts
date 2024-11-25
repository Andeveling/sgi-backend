import { Type } from 'class-transformer';
import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number) 
  price: number;

  @IsInt()
  @Type(() => Number)
  quantity: number;
}
