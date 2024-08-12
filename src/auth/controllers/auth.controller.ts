import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { HashingService } from '../services/hashing.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly hashingService: HashingService,
  ) {}
}
