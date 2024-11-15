import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...orderData } = createOrderDto;

    try {
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          orderItems: {
            create: orderItems,
          },
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany();
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: Order['id']) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(id: Order['id'], updateOrderDto: UpdateOrderDto) {
    try {
      const { orderItems, ...orderData } = updateOrderDto;
      const order = await this.prisma.order.update({
        where: { id },
        data: {
          ...orderData,
          orderItems: {
            create: orderItems,
          },
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  remove(id: Order['id']) {
    try {
      return this.prisma.order.delete({
        where: { id },
      });
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
