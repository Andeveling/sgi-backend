import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  public login(@Body() req: { email: string; password: string }) {
    const { email, password } = req;
    return this.authService.login({ email, password });
  }

  @Post('register')
  public register(@Body() registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    return this.authService.register({ name, email, password });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public getProfile(@Request() req: Request) {
    return req['user'];
  }
}
