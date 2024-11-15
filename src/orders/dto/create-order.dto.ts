import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsString,
  ValidateNested
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  storeId: string;

  @IsString()
  customerId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
