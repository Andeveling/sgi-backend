import { Module } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ TaskCommentsService ],
  exports: [ TaskCommentsService ]
})
export class TaskCommentsModule {}
