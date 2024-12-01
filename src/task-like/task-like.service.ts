import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskLikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(taskId: string, userId: string) {
    // Verificar si ya existe el "like"
    const existingLike = await this.prisma.taskLike.findUnique({
      where: { taskId_userId_unique: { taskId, userId } },
    });

    if (existingLike) {
      // Si existe, eliminar el "like"
      await this.prisma.taskLike.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      // Si no existe, agregar un nuevo "like"
      await this.prisma.taskLike.create({
        data: { taskId, userId },
      });
      return { liked: true };
    }
  }

  async getLikes(taskId: string) {
    const likes = await this.prisma.taskLike.findMany({
      where: { taskId },
      include: { user: true },
    });

    return { count: likes.length, users: likes.map((like) => like.user) };
  }

  async isStarred(taskId: string, userId: string) {
    const like = await this.prisma.taskLike.findUnique({
      where: { taskId_userId_unique: { taskId, userId } },
    });

    return { isStarred: !!like };
  }
}
