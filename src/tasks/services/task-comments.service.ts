import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskCommentDto } from '../dto/create-task-comment';
import { PrismaService } from '@/prisma/services/prisma.service';
import { UpdateTaskCommentDto } from '../dto/update-task-comment';


@Injectable()
export class TaskCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.taskComment.findMany();
  }

  async findOne(id: string) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`TaskComment with ID ${id} not found`);
    }
    return comment;
  }

  async create(createTaskCommentDto: CreateTaskCommentDto) {
    return this.prisma.taskComment.create({ data: createTaskCommentDto });
  }

  async update(id: string, updateTaskCommentDto: Partial<UpdateTaskCommentDto>) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`TaskComment with ID ${id} not found`);
    }
    return this.prisma.taskComment.update({
      where: { id },
      data: updateTaskCommentDto,
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`TaskComment with ID ${id} not found`);
    }
    return this.prisma.taskComment.delete({ where: { id } });
  }
}
