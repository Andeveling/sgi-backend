import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { HashingService } from './services/hashing.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    EmailModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: envs.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashingService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
