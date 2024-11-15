import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ErrorHandler } from '@/core/errors/error.handler';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...orderData } = createOrderDto;

    try {
      const productsIds = orderItems.map((item) => item.productId);

      const products = await this.prisma.product.findMany({
        where: { id: { in: productsIds } },
        select: { id: true, name: true, sellPrice: true },
      });

      const missingProducts = productsIds.filter(
        (id) => !products.some((product) => product.id === id),
      );
      if (missingProducts.length > 0) {
        ErrorHandler.notFound('The following products were not found');
      }

      const totalAmount = orderItems.reduce((acc, item) => {
        const product = products.find(
          (product) => product.id === item.productId,
        );
        if (!product) {
          ErrorHandler.notFound(`Product with ID ${item.productId} not found`);
        }
        return acc + item.quantity * product.sellPrice;
      }, 0);

      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          totalAmount,
          orderItems: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find((product) => product.id === item.productId)
                ?.sellPrice,
            })),
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
