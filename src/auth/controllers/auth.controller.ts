import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() req: LoginDto) {
    const { email, password } = req;
    return this.authService.login({ email, password });
  }
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    return this.authService.register({ name, email, password });
  }
}
