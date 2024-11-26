import { PrismaService } from '@/prisma/services/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from '../dto/create-column.dto';
import { UpdateColumnDto } from '../dto/update-column.dto';
import { ErrorHandler } from '@/core/errors/error.handler';

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

    return await this.prisma.column.create({
      data: {
        title,
        boardId,
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
}
