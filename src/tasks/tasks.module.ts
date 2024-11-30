import { BoardsModule } from '@/boards/boards.module';
import { ColumnsModule } from '@/columns/columns.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TaskCommentsController } from './controllers/task-comments.controller';
import { TasksController } from './controllers/tasks.controller';
import { TaskCommentsService } from './services/task-comments.service';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [BoardsModule, PrismaModule, ColumnsModule],
  controllers: [TasksController,TaskCommentsController],
  providers: [TasksService,TaskCommentsService],
})
export class TasksModule {}
