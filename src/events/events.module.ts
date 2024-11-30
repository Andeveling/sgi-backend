import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TaskLikeModule } from '@/task-like/task-like.module';
import { TaskCommentsModule } from '@/task-comments/task-comments.module';

@Module({
  imports: [TaskLikeModule, TaskCommentsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
