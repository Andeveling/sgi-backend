import { ErrorHandler } from '@/core/errors/error.handler';
import { PrismaService } from '@/prisma/services/prisma.service';
import { ProductsService } from '@/products/services/products.service';
import { Injectable } from '@nestjs/common';
import { MovementType, Order, OrderStatus } from '@prisma/client';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import {
  EventsGateway,
  MultipleProductDataNotification,
} from '@/events/events.gateway';
import { RedisService } from '@/redis/services/redis.service';

@Injectable()
export class OrdersService {
  private readonly PRODUCTS_KEY = 'products';
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly eventsGateway: EventsGateway,
    private readonly redis: RedisService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderItems, ...orderData } = createOrderDto;
    const productsIds = [...new Set(orderItems.map((item) => item.productId))];
    console.log(productsIds);
    console.log(orderItems);
    console.log(orderData);
    try {
      const order = await this.prisma.$transaction(async (tx) => {
        const products = await tx.product.findMany({
          where: { id: { in: productsIds } },
          select: { id: true, name: true, sellPrice: true, stock: true },
        });

        console.log(products);

        const missingProducts = productsIds.filter(
          (id) => !products.some((product) => product.id === id),
        );
        if (missingProducts.length > 0) {
          ErrorHandler.notFound('The following products were not found');
        }

        let totalAmount = 0;
        for (const item of orderItems) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) {
            ErrorHandler.notFound(
              `Product with ID ${item.productId} not found`,
            );
          }

          if (product.stock < item.quantity) {
            ErrorHandler.createSignatureError(
              `Insufficient stock for product ${product.name}`,
            );
          }

          totalAmount += item.quantity * product.sellPrice;
        }

        const newOrder = await tx.order.create({
          data: {
            ...orderData,
            totalAmount,
            orderItems: {
              create: orderItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: products.find((p) => p.id === item.productId)?.sellPrice,
              })),
            },
          },
          include: {
            orderItems: true,
          },
        });

        for (const item of newOrder.orderItems) {
          await this.productsService.updateProductStock(
            tx,
            item.productId,
            item.quantity,
            MovementType.SALE,
          );
        }

        return newOrder;
      });

      const updatedProducts = await this.prisma.product.findMany({
        where: { id: { in: productsIds } },
        select: { id: true, name: true, stock: true },
      });

      const updatedProductsMultiple: MultipleProductDataNotification = {
        products: updatedProducts.map((product) => ({
          productId: product.id,
          newStock: product.stock,
        })),
      };

      try {
        this.eventsGateway.notifyProductsStockUpdate(updatedProductsMultiple);
      } catch (error) {
        console.error('Error emitting stock update event:', error);
      }

      return {
        message: 'Order created successfully',
        order,
      };
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
        include: { orderItems: true },
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
    } catch (error) {
      throw error;
    }
  }

  async fulfill(id: Order['id']) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) {
        ErrorHandler.notFound('Order not found');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.FULFILLED,
          fulfilledAt: new Date(),
          orderItems: {
            updateMany: {
              where: { quantity: { gt: 0 } },
              data: { quantity: { decrement: 1 } },
            },
          },
        },
        include: { orderItems: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async cancel(id: Order['id']) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });
      if (!order) {
        ErrorHandler.notFound('Order not found');
      }
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
          orderItems: {
            updateMany: {
              where: { quantity: { gt: 0 } },
              data: { quantity: { decrement: 1 } },
            },
          },
        },
        include: { orderItems: true },
      });
      const updatedProducts = await this.prisma.product.findMany({
        where: {
          id: { in: updatedOrder.orderItems.map((item) => item.productId) },
        },
      });
      const updatedProductsMultiple: MultipleProductDataNotification = {
        products: updatedProducts.map((product) => ({
          productId: product.id,
          newStock: product.stock,
        })),
      };
      try {
        this.eventsGateway.notifyProductsStockUpdate(updatedProductsMultiple);
      } catch (error) {
        console.error('Error emitting stock update event:', error);
      }
      return {
        message: 'Order cancelled successfully',
        order,
      };
    } catch (error) {
      throw error;
    }
  }
}
