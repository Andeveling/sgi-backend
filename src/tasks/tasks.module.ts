import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { BoardsModule } from '@/boards/boards.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ColumnsModule } from '@/columns/columns.module';

@Module({
  imports: [BoardsModule, PrismaModule, ColumnsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
