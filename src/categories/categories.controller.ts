import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import { Roles } from '@/auth/decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  public create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  public findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get(':id')
  public findOne(@Param('id') id: Category['id']) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  public update(
    @Param('id') id: Category['id'],
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: Category['id']) {
    return this.categoriesService.remove(id);
  }
}
