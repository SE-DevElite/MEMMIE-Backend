import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { config } from 'dotenv';
import { FacebookStrategy } from '@/strategy/facebook.strategy';

config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      privateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  providers: [UserService, AuthService, FacebookStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
