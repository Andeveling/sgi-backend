import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { CategoriesModule } from './categories/categories.module';
import { AllExceptionFilter } from './core/errors/all-exeption.filter';
import { JwtAuthGuard } from './auth/guards';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    StoreModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
