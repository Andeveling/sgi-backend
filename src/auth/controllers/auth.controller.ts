import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/public';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @Public()
  public login(@Body() req: { email: string; password: string }) {
    const { email, password } = req;
    return this.authService.login({ email, password });
  }

  @Post('register')
  // @UseGuards(AuthGuard('local'))
  @Public()
  public register(@Body() registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    return this.authService.register({ name, email, password });
  }

  @Get('profile')
  public getProfile(@Request() req: Request) {
    return req['user'];
  }
}
