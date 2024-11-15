import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  orderNumber?: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsInt()
  totalAmount: number;

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
