import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public/public.decorator';
import { LocalGuard } from '../guards/local/local.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalGuard)
  public login(@Body() req: { email: string; password: string }) {
    const { email, password } = req;
    return this.authService.login({ email, password });
  }

  @Post('register')
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
