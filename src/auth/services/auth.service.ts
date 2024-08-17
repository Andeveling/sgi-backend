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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
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
      });
      return successMessage;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Lanzar la excepción específica con un mensaje al cliente
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while registering the user.',
      );
    }
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: `Bearer ${string}` }> {
    const { email, password } = loginDto;
    try {
      const user = await this.userService.findOneUserByEmail(email);

      if (!user) {
        throw new NotFoundException('No user found with the provided email');
      }

      const comparePassword = await this.hashingService.comparePassword(
        password,
        user.password,
      );
      if (!comparePassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        username: user.name,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken: `Bearer ${accessToken}` };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // Relanzar excepciones específicas para que el cliente reciba el mensaje adecuado
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during login. Please try again later.',
      );
    }
  }
}
