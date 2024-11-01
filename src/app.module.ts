import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { AllExceptionFilter } from './core/errors/all-exeption.filter';
import { StoreModule } from './store/store.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    StoreModule,
    CategoriesModule,
    // ProductsModule,
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
