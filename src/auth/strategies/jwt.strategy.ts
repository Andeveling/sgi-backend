import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import { PayloadToken } from '../interfaces';
import { ErrorHandler } from '@/core/errors/error.handler';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.secret,
    });
  }

  public validate(payload: PayloadToken): PayloadToken {
    const { roles } = payload;
    if (!roles) {
      throw ErrorHandler.forbidden('Forbidden access');
    }
    return payload;
  }
}
