import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Store } from '@prisma/client';
import { UsersService } from '@/users/services/users.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { ErrorHandler } from '@/core/errors/error.handler';
import { Roles } from '@/auth/decorators';

@Injectable()
export class StoreService extends PrismaClient implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  public async onModuleInit() {
    await this.$connect();
  }

  @Roles('ADMIN')
  public async create(userId: string, createStoreDto: CreateStoreDto) {
    try {
      // Validamos si el usuario tiene una tienda
      const user = await this.usersService.findOneById(userId);
      if (user.storeId) {
        throw ErrorHandler.createSignatureError('You already have a store');
      }

      const store = await this.store.create({
        data: {
          ...createStoreDto,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await this.usersService.updateStore(userId, store.id);

      return store;
    } catch (error) {
      throw error;
    }
  }

  public async findAll() {
    return `This action returns all store`;
  }

  public async findOne(id: Store['id']) {
    return `This action returns a #${id} store`;
  }

  public async update(id: Store['id'], updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  public async remove(id: Store['id']) {
    return `This action removes a #${id} store`;
  }
}
