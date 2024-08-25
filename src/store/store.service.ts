import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class StoreService {
  public async create(createStoreDto: CreateStoreDto) {
    // try {
    //   const store = await this.store.create({
    //     data: createStoreDto,
    //   });
    //   return store;
    // } catch (error) {
    //   throw error;
    // }
  }

  public async findAll() {
    return `This action returns all store`;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  public async update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
