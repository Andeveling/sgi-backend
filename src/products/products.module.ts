import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { MovementsModule } from '@/movements/movements.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [MovementsModule, PrismaModule, RedisModule, EventsModule],
  controllers: [ProductsController],
  providers: [ ProductsService ],
  exports: [ ProductsService ]
})
export class ProductsModule {}
