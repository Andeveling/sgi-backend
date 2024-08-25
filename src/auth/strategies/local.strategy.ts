import { ErrorHandler } from '@/core/errors/error.handler';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({
      email,
      pass: password,
    });
    if (!user) {
      throw ErrorHandler.unauthorized('Invalid credentials');
    }
    return user;
  }
}
