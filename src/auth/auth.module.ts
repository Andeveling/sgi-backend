import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
