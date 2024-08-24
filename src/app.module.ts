import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    AuthModule,
    // Proteccion de ataques de brute force y ataques DDoS
    ThrottlerModule.forRoot([
      {
        ttl: 180,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
