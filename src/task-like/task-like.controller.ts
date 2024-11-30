import { Controller, Post, Param, Get, Body } from '@nestjs/common';
import { TaskLikeService } from './task-like.service';

@Controller('tasks/:taskId/likes')
export class TaskLikeController {
  constructor(private readonly taskLikeService: TaskLikeService) {}

  @Post('toggle')
  async toggleLike(
    @Param('taskId') taskId: string,
    @Body('userId') userId: string,
  ) {
    return this.taskLikeService.toggleLike(taskId, userId);
  }

  @Get()
  async getLikes(@Param('taskId') taskId: string) {
    return this.taskLikeService.getLikes(taskId);
  }
}
