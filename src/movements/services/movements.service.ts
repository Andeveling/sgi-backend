import { Injectable } from '@nestjs/common';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class MovementsService {
  async createInitialStockMovementInTransaction(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number,
  ) {
    return await tx.movement.create({
      data: {
        type: MovementType.INITIAL_STOCK,
        quantity,
        productId,
      },
    });
  }
}
