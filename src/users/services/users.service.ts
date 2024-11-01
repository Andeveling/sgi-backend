import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Store, User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, cellphone } = createUserDto;
    try {
      await this.user.create({
        data: {
          name,
          email,
          cellphone,
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

  public async updateStore(userId: User['id'], storeId: Store['id']) {
    return await this.user.update({
      where: {
        id: userId,
      },
      data: {
        storeId: storeId,
      },
    });
  }

  public async findOneUserByEmail(email: User['email']): Promise<User> {
    return await this.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  public async findOneById(id: User['id']): Promise<User> {
    return await this.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
