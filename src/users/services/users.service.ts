import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    try {
      await this.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      return { message: 'User created successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user. Please try again later.',
      );
    }
  }

  public async findOneUserByEmail(email: User['email']): Promise<User> {
    return await this.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
