import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Configura el campo de email como username
  }

  async validate(email: string, password: string) {
    console.log('Aca estoy entrando al validate', { email, password });
    const user = await this.authService.validateUser({
      email,
      pass: password,
    });
    if (!user) {
      console.log('Usuario no encontrado o credenciales inválidas');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
}