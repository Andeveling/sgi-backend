import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { HashingService } from './hashing.service';
import { TokenAccessWithUser, PayloadToken, BearerToken } from '../interfaces';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const { email, password, name, cellphone } = registerDto;
    try {
      const findUser = await this.userService.findOneUserByEmail(email);
      if (findUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await this.hashingService.hashPassword(password);
      const successMessage = await this.userService.createUser({
        email,
        password: hashedPassword,
        name,
        cellphone,
      });
      return successMessage;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while registering the user.',
      );
    }
  }

  public async login(loginDto: LoginDto): Promise<TokenAccessWithUser> {
    const { email, password } = loginDto;
    const user = await this.validateUser({ email, pass: password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    try {
      const userWithOutPassword = { ...user, password: undefined };
      const accessToken = await this.generateJWTToken(userWithOutPassword);
      return accessToken;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during login. Please try again later.',
      );
    }
  }

  public async validateUser({ email, pass }: { email: string; pass: string }) {
    const user = await this.userService.findOneUserByEmail(email);
    if (user) {
      const { password, ...result } = user;
      const comparePassword = await this.hashingService.comparePassword(
        pass,
        password,
      );
      if (comparePassword) return result;
    } else {
      return null;
    }
  }

  private async generateJWTToken(user: User) {
    const payload: PayloadToken = {
      sub: user.id,
      id: user.id,
      name: user.name,
      cellphone: user.cellphone,
      email: user.email,
      isNew: user.isNew,
      roles: user.roles,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const accessTokenObject: TokenAccessWithUser = {
      user: {
        id: user.id,
        name: user.name,
        cellphone: user.cellphone,
        email: user.email,
        isNew: user.isNew,
        roles: user.roles,
      },
      token: accessToken as BearerToken,
    };
    return accessTokenObject;
  }
}
