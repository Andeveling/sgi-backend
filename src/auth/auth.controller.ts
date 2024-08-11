import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashingService } from './hashing.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly hashingService: HashingService,
  ) {}
}
