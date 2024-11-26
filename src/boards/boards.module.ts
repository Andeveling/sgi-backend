import { Module } from '@nestjs/common';
import { BoardsService } from './services/boards.service';
import { BoardsController } from './controllers/boards.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
