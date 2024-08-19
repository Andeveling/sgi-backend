import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { Product } from '@prisma/client';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAllProducts(paginationDto);
  }

  @Get(':id')
  findOneProduct(@Param('id') id: Product['id']) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: Product['id'],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: Product['id']) {
    return this.productsService.removeProduct(id);
  }
}
