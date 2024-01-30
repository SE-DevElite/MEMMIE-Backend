import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from '../users/user.service';
import { config } from 'dotenv';
import { FacebookStrategy } from '@/strategy/facebook.strategy';
import { GoogleStrategy } from '@/strategy/google.strategy';
import { AWSService } from '../aws/aws.service';

config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      privateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [
    UserService,
    AuthService,
    FacebookStrategy,
    GoogleStrategy,
    AWSService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
