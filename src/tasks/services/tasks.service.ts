import { ErrorHandler } from '@/core/errors/error.handler';
import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { MoveTaskDto } from '../dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { columnId } = createTaskDto;

    const position = await this.prisma.task.count({
      where: { columnId },
    });

    createTaskDto.position = position + 1;

    const columnExists = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!columnExists) {
      ErrorHandler.notFound('Column not found');
    }

    return await this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll(columnId: string) {
    return await this.prisma.task.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      ErrorHandler.notFound(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      ErrorHandler.notFound(`Task with ID ${id} not found`);
    }

    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      ErrorHandler.notFound(`Task with ID ${id} not found`);
    }

    return await this.prisma.task.delete({
      where: { id },
    });
  }

  async moveTask(moveTaskDto: MoveTaskDto) {
    const { taskId, targetColumnId, targetPosition } = moveTaskDto;

    // Buscar la tarea actual
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      ErrorHandler.notFound(`Task with ID ${taskId} not found`);
    }

    // Validar que la columna destino existe
    const targetColumn = await this.prisma.column.findUnique({
      where: { id: targetColumnId },
    });

    if (!targetColumn) {
      ErrorHandler.notFound(`Column with ID ${targetColumnId} not found`);
    }

    // Si la columna es diferente, actualizar ambas columnas
    if (task.columnId !== targetColumnId) {
      // Actualizar posiciones en la columna de origen
      await this.prisma.task.updateMany({
        where: {
          columnId: task.columnId,
          position: { gt: task.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // Insertar en la columna destino
      await this.prisma.task.updateMany({
        where: {
          columnId: targetColumnId,
          position: { gte: targetPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      // Mover la tarea
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          columnId: targetColumnId,
          position: targetPosition,
        },
      });
    } else {
      // Si la columna es la misma, reordenar posiciones
      if (task.position < targetPosition) {
        // Mover hacia abajo
        await this.prisma.task.updateMany({
          where: {
            columnId: task.columnId,
            position: { gt: task.position, lte: targetPosition },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      } else if (task.position > targetPosition) {
        // Mover hacia arriba
        await this.prisma.task.updateMany({
          where: {
            columnId: task.columnId,
            position: { gte: targetPosition, lt: task.position },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }

      // Actualizar posición de la tarea
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          position: targetPosition,
        },
      });
    }
  }

  async findAllTasksByBoard(boardId: string) {
    return await this.prisma.task.findMany({
      where: { column: { boardId } },
      orderBy: { position: 'asc' },
    });
  }
}
