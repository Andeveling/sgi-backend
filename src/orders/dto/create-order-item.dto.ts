import { IsInt, IsString, IsDecimal } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  orderId: string;

  @IsDecimal()
  price: number;

  @IsInt()
  quantity: number;
}
