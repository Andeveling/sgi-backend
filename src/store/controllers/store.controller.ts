import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Store } from '@prisma/client';
import { GetUser } from '@/auth/decorators/get-user/get-user.decorator';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreService } from '../services/store.service';


  @Controller('stores')
  export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Post()
    public create(
      @GetUser('sub') userId: string,
      @Body() createStoreDto: CreateStoreDto,
    ) {
      return this.storeService.create(userId, createStoreDto);
    }

    @Get()
    public findAll(@GetUser('sub') userId: string) {
      return this.storeService.findAll(userId);
    }

    @Get()
    public findOne(@GetUser('sub') userId: string) {
      return this.storeService.findOne(userId);
    }

    @Patch(':id')
    public update(
      @Param('id') id: Store['id'],
      @Body() updateStoreDto: UpdateStoreDto,
    ) {
      return this.storeService.update(id, updateStoreDto);
    }

    @Delete(':id')
    public remove(@Param('id') id: Store['id']) {
      return this.storeService.remove(id);
    }
  }
