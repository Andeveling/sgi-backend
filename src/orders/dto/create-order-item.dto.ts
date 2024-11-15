import { IsInt, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  orderId: string;

  @IsInt()
  quantity: number;
}
