import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.user.create({
        data: createUserDto,
      });
      return newUser;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }
}
