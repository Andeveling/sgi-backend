import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ErrorHandler } from '@/core/errors/error.handler';
import { MoveColumnDto } from '../dto/move-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto) {
    const { title, boardId } = createColumnDto;

    const boardExists = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!boardExists) {
      ErrorHandler.notFound('Board not found');
    }

    const position = await this.prisma.column.count({
      where: { boardId },
    });

    createColumnDto.position = position + 1;

    return await this.prisma.column.create({
      data: {
        title,
        boardId,
        position: createColumnDto.position,
      },
    });
  }

  // Listar todas las columnas de un tablero
  async findAll(boardId: string) {
    return await this.prisma.column.findMany({
      where: { boardId },
    });
  }

  // Obtener una columna específica por su ID
  async findOne(id: string) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }

    return column;
  }

  // Actualizar una columna
  async update(id: string, updateColumnDto: UpdateColumnDto) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }

    return await this.prisma.column.update({
      where: { id },
      data: updateColumnDto,
    });
  }

  // Eliminar una columna
  async remove(id: string) {
    const column = await this.prisma.column.findUnique({
      where: { id },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID ${id} not found`);
    }

    return await this.prisma.column.delete({
      where: { id },
    });
  }

  async moveColumn(moveColumnDto: MoveColumnDto) {
    const { columnId, targetBoardId, targetPosition } = moveColumnDto;

    // Buscar la columna actual
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      ErrorHandler.notFound(`Column with ID ${columnId} not found`);
    }

    // Validar que la columna destino existe
    const targetBoard = await this.prisma.board.findUnique({
      where: { id: targetBoardId },
    });

    if (!targetBoard) {
      ErrorHandler.notFound(`Board with ID ${targetBoardId} not found`);
    }

    // Si la columna es diferente, actualizar ambas columnas
    if (column.boardId !== targetBoardId) {
      // Actualizar posiciones en la columna de origen
      await this.prisma.column.updateMany({
        where: {
          boardId: column.boardId,
          position: { gt: column.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // Insertar en la columna destino
      await this.prisma.column.updateMany({
        where: {
          boardId: targetBoardId,
          position: { gte: targetPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      // Mover la columna
      return await this.prisma.column.update({
        where: { id: columnId },
        data: {
          boardId: targetBoardId,
          position: targetPosition,
        },
      });
    } else {
      // Si la columna es la misma, reordenar posiciones
      if (column.position < targetPosition) {
        // Mover hacia abajo
        await this.prisma.column.updateMany({
          where: {
            boardId: column.boardId,
            position: { gt: column.position, lte: targetPosition },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      } else if (column.position > targetPosition) {
        // Mover hacia arriba
        await this.prisma.column.updateMany({
          where: {
            boardId: column.boardId,
            position: { gte: targetPosition, lt: column.position },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }

      // Actualizar posición de la columna
      return await this.prisma.column.update({
        where: { id: columnId },
        data: {
          position: targetPosition,
        },
      });
    }
  }
}
