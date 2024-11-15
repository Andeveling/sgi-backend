import { IsInt, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsInt()
  price: number;
}
