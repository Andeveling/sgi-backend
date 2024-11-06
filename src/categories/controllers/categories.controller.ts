import { Roles } from '@/auth/decorators';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles('USER')
  @UseGuards(RolesGuard)
  @Post()
  public create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log(createCategoryDto);
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  public findAll() {
    return this.categoriesService.findAll();
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
