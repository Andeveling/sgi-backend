import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { HashingService } from 'src/auth/services/hashing.service';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  constructor(private readonly hashingService: HashingService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    try {
      const hashedPassword = await this.hashingService.hashPassword(password);

      if (typeof hashedPassword === 'string') {
        await this.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return { message: 'User created successfully' };
      }
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }
}
