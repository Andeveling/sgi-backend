import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(taskId: string, userId: string, content: string) {
    try {
      await this.prisma.taskComment.create({
        data: {
          taskId,
          userId,
          content,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllComments(taskId: string) {
    try {
      const comments = await this.prisma.taskComment.findMany({
        where: { taskId },
        include: { author: true },
      });
      return comments;
    } catch (error) {
      throw error;
    }
  }
    
  async countAllComments(taskId: string) {
    try {
      const count = await this.prisma.taskComment.count({
        where: { taskId },
      });
      return count;
    } catch (error) {
      throw error;
    }
  }
}
