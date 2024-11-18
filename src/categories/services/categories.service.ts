import { Injectable, OnModuleInit } from '@nestjs/common';
import { Category, PrismaClient } from '@prisma/client';
import {
  GetOneResponse,
  RemoveResponse,
  StatusResponse
} from 'src/interfaces/api-response.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  

  public async create(createCategoryDto: CreateCategoryDto) {
    const { storeId, name } = createCategoryDto;
    try {
      
      const category = await this.category.create({
        data: {
          name,
          storeId: storeId,
        },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<Category[]> {
    try {
      const categories = await this.category.findMany();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(
    id: Category['id'],
  ): Promise<GetOneResponse<Omit<Category, 'storeId'>>> {
    try {
      const category = await this.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
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
  ) {
    const { name, storeId } = updateCategoryDto;
    try {
      const category = await this.category.update({
        where: { id },
        data: {
          name,
          storeId,
        },
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
      const category = await this.category.delete({ where: { id } });
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
