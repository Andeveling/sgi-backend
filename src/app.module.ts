import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { AllExceptionFilter } from './core/errors/all-exeption.filter';
import { StoreModule } from './store/store.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from '@/config/mailer.config';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';



@Module({
  imports: [
    UsersModule,
    AuthModule,
    StoreModule,
    CategoriesModule,
    ProductsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 180,
        limit: 10,
      },
    ]),
    MailerModule.forRoot(mailerConfig),
    EmailModule
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
