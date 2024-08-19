import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const product = await this.product.create({
        data: createProductDto,
      });
      if (!product) {
        throw new HttpException('No product found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllProducts(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10 } = paginationDto;

      const totalProducts = await this.product.count();
      if (totalProducts === 0) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }
      const totalPages = Math.ceil(totalProducts / limit);
      const currentPage = page / limit + 1;

      const products = await this.product.findMany({
        where: { available: true },
        skip: (currentPage - 1) * limit,
        take: limit,
      });
      return {
        data: products,
        products: totalProducts,
        total: totalPages,
        current: currentPage,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneProduct(id: Product['id']) {
    try {
      const product = await this.product.findUnique({
        where: {
          id: id,
          available: true,
        },
      });
      if (!product) {
        throw new HttpException('No product found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(id: Product['id'], updateProductDto: UpdateProductDto) {
    try {
      const product = await this.product.update({
        where: {
          id: id,
        },
        data: updateProductDto,
      });
      if (!product) {
        throw new HttpException('No product found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeProduct(id: Product['id']) {
    try {
      const product = await this.product.update({
        where: {
          id: id,
        },
        data: {
          available: false,
        },
      });
      if (!product) {
        throw new HttpException('No product found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }
}