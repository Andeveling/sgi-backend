import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { UsersService } from '@/users/services/users.service';
import { EmailModule } from '@/email/email.module';

@Module({
  imports:[EmailModule],
  controllers: [StoreController],
  providers: [StoreService, UsersService],
})
export class StoreModule {}
