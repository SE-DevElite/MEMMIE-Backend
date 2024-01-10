import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { time } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<string | null> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    const payload = {
      user_id: user.user_id,
      create_at: time(),
    };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
