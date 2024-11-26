import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { PrismaService } from '@/prisma/services/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}
  public async create(createBoardDto: CreateBoardDto) {
    try {
      const board = this.prisma.board.create({
        data: createBoardDto,
      });
      return board;
    } catch (error) {
      throw error;
    }
  }

  public async findAll() {
    try {
      const boards = this.prisma.board.findMany();
      return boards;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: string) {
    try {
      const board = await this.prisma.board.findUnique({
        where: {
          id: id,
        },
      });
      return board;
    } catch (error) {}
  }

  public async update(id: string, updateBoardDto: UpdateBoardDto) {
    try {
      const board = await this.prisma.board.update({
        where: {
          id: id,
        },
        data: updateBoardDto,
      });
      return board;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: string) {
    try {
      const board = await this.prisma.board.delete({
        where: {
          id: id,
        },
      });
      return board;
    } catch (error) {
      throw error;
    }
  }
}
