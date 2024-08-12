import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { HashingService } from 'src/auth/services/hashing.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashingService],
})
export class UsersModule {}
