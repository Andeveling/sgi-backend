import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Store, User } from '@prisma/client';
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

  @Roles('USER')
  public async create(userId: string, createStoreDto: CreateStoreDto) {
    try {
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
      await this.usersService.updateIsNew(userId);
      await this.usersService.updateStore(userId, store.id);

      return store;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(userId: User['id']) {
    try {
      const stores = await this.store.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      });
      return stores;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(userId: User['id']) {
    try {
      const user = await this.usersService.findOneById(userId);

      if (!user) {
        throw ErrorHandler.createSignatureError('User not found');
      }

      const store = await this.store.findUnique({
        where: {
          id: user.storeId,
        },
      });

      if (!store) {
        throw ErrorHandler.createSignatureError('Store not found');
      }
      return store;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: Store['id'], updateStoreDto: UpdateStoreDto) {
    try {
      const store = await this.store.update({
        where: {
          id,
        },
        data: updateStoreDto,
      });

      return {
        message: 'Store updated successfully',
        store,
      };
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: Store['id']) {
    try {
      const store = await this.store.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Store deleted successfully',
        store,
      };
    } catch (error) {
      throw error;
    }
  }
}
