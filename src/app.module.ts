import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, AuthModule, StoreModule, ProductsModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
