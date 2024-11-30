import { Module } from '@nestjs/common';
import { TaskLikeService } from './task-like.service';
import { TaskLikeController } from './task-like.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TaskLikeService],
  controllers: [ TaskLikeController ],
  exports: [ TaskLikeService ]
})
export class TaskLikeModule {}
