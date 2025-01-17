import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { ProductsService } from 'src/products/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  public findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  public findOneProduct(@Param('id') id: Product['id']) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  public updateProduct(
    @Param('id') id: Product['id'],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  public removeProduct(@Param('id') id: Product['id']) {
    return this.productsService.removeProduct(id);
  }
}
