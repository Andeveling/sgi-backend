import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from 'prisma/src/products/dto/create-product.dto';
import { UpdateProductDto } from 'prisma/src/products/dto/update-product.dto';
import { PaginationDto } from 'prisma/src/common';
import { Product } from '@prisma/client';
import { ProductsService } from 'prisma/src/products/services/products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  public findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAllProducts(paginationDto);
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
