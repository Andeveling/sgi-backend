import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../decorators/public/public.decorator';
import { RegisterDto } from '../dto/register.dto';
import { LocalGuard } from '../guards/local/local.guard';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  // @UseGuards(LocalGuard)
  public login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Post('register')
  @Public()
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  public getProfile(@Request() req: Request) {
    return req['user'];
  }
}
