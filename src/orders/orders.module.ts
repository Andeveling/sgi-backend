import { MovementsModule } from '@/movements/movements.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';
import { RedisModule } from '@/redis/redis.module';
import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ProductsModule,
    MovementsModule,
    EventsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
