import { ErrorHandler } from 'prisma/src/core/errors/error.handler';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { PaginationDto } from 'prisma/src/common';
import { CreateProductDto } from 'prisma/src/products/dto/create-product.dto';
import { UpdateProductDto } from 'prisma/src/products/dto/update-product.dto';
import {
  GetAllResponse,
  GetOneResponse,
  PostResponse,
  RemoveResponse,
  StatusResponse,
  UpdateResponse,
} from 'prisma/src/interfaces/api-response.interface';
import { Pagination } from 'prisma/src/common/entities/pagination.entity';
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<PostResponse<Product>> {
    try {
      const product = await this.product.create({
        data: createProductDto,
      });
      if (!product) {
        ErrorHandler.notFound('No product found');
      }
      return {
        status: StatusResponse.Success,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  public async findAllProducts(
    paginationDto: PaginationDto,
  ): Promise<GetAllResponse<Product>> {
    try {
      const { offset, limit } = paginationDto;
      const totalItems = await this.product.count();
      if (totalItems === 0) ErrorHandler.notFound('No products found');
      const pagination = new Pagination({ limit, offset, totalItems });

      const products = await this.product.findMany({
        where: { available: true },
        skip: offset,
        take: limit,
      });
      return {
        status: StatusResponse.Success,
        message: 'Products found successfully', // Mensaje de respuesta
        data: products, // Datos de la respuesta
        pagination: pagination.getPaginationInfo(), // Datos de paginación
      };
    } catch (error) {
      throw error;
    }
  }

  public async findOneProduct(
    id: Product['id'],
  ): Promise<GetOneResponse<Product>> {
    try {
      const product = await this.product.findUnique({
        where: {
          id: id,
          available: true,
        },
      });
      if (!product) {
        ErrorHandler.notFound('No product found');
      }
      return {
        status: StatusResponse.Success,
        message: 'Product found successfully',
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateProduct(
    id: Product['id'],
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResponse<Product>> {
    try {
      const product = await this.product.update({
        where: {
          id: id,
        },
        data: updateProductDto,
      });
      if (!product) {
        ErrorHandler.notFound('No product found');
      }
      return {
        status: StatusResponse.Success,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }

  public async removeProduct(id: Product['id']): Promise<RemoveResponse> {
    try {
      const product = await this.product.update({
        where: {
          id: id,
        },
        data: {
          available: false,
        },
      });
      if (!product) ErrorHandler.notFound('No product found');

      return {
        status: StatusResponse.Success,
        message: 'Product deleted successfully',
        deleted_id: product.id,
      };
    } catch (error) {
      throw error;
    }
  }
}
