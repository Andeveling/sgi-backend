import { Module } from '@nestjs/common';
import { ColumnsController } from './controllers/columns.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { BoardsModule } from '@/boards/boards.module';
import { ColumnsService } from './services/columns.service';

@Module({
  imports: [PrismaModule, BoardsModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
