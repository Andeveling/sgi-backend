import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class MovementsService {

  constructor(private readonly prisma: PrismaService) {}


  async createInitialStockMovementInTransaction(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number,
    storeId: string,
  ) {
    return await tx.movement.create({
      data: {
        type: MovementType.INITIAL_STOCK,
        storeId,
        quantity,
        productId,
      },
    });
  }


  async findAll(storeId: string) {
    return await this.prisma.movement.findMany({
      where: { storeId },
      include: { product: true },
    });
  }
}
