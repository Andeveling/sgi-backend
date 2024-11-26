import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { AllExceptionFilter } from './core/errors/all-exception.filter';
import { StoreModule } from './store/store.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '@/config/mailer.config';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { EventsModule } from './events/events.module';
import { MovementsModule } from './movements/movements.module';
import { RedisModule } from './redis/redis.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    StoreModule,
    CategoriesModule,
    ProductsModule,
    EmailModule,
    CustomersModule,
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        ttl: 180,
        limit: 10,
      },
    ]),
    MailerModule.forRoot(mailerConfig),
    OrdersModule,
    EventsModule,
    MovementsModule,
    RedisModule,
    EmailModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
