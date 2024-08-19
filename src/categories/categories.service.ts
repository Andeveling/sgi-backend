import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { OnModuleInit } from '@nestjs/common';
import { Category, PrismaClient } from '@prisma/client';
import {
  GetAllResponse,
  GetOneResponse,
  RemoveResponse,
  StatusResponse,
  UpdateResponse,
} from 'src/interfaces/api-response.interface';
import { PaginationDto } from 'src/common';
import { Pagination } from 'src/common/entities/pagination.entity';
import { ErrorHandler } from 'src/core/errors/error.handler';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  public async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;
    try {
      const category = await this.category.create({
        data: { name, description },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<GetAllResponse<Category>> {
    const { limit, offset } = paginationDto;
    try {
      const categories = await this.category.findMany({
        take: limit,
        skip: offset,
      });
      const totalItems = await this.category.count();
      if (totalItems === 0) ErrorHandler.notFound('No categories found');
      const pagination = new Pagination({ limit, offset, totalItems });

      return {
        status: StatusResponse.Success,
        message: 'Categories found successfully',
        data: categories,
        pagination: pagination.getPaginationInfo(),
      };
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: Category['id']): Promise<GetOneResponse<Category>> {
    try {
      const category = await this.category.findUnique({
        where: { id },
      });
      return {
        status: StatusResponse.Success,
        message: 'Category found successfully',
        data: category,
      };
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: Category['id'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResponse<Category>> {
    const { name, description } = updateCategoryDto;
    try {
      const category = await this.category.update({
        where: { id },
        data: { name, description },
      });
      return {
        status: StatusResponse.Success,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: Category['id']): Promise<RemoveResponse> {
    try {
      const category = await this.category.update({
        where: { id },
        data: { available: false },
      });
      return {
        status: StatusResponse.Success,
        message: 'Category deleted successfully',
        deleted_id: category.id,
      };
    } catch (error) {
      throw error;
    }
  }
}
