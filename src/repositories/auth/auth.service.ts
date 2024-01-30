import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { IJWT } from '@/interfaces/IAuthRequest';
import { GenderEnum } from '@/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  generateToken(payload: IJWT) {
    return this.jwtService.sign(payload);
  }

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

    const payload: IJWT = {
      user_id: user.user_id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async createOrLoginUser(
    email: string,
    name: string,
    picture: string,
    username: string,
    provider: string,
  ): Promise<string | null> {
    let user = await this.usersService.getUserByEmail(email);

    if (!user) {
      user = await this.usersService.createUserByEmailAndPassword(
        email,
        process.env.DEFAULT_PASSWORD,
        provider,
        name,
        picture,
        username,
        GenderEnum.OTHER,
      );

      if (!user) {
        return null;
      }
    }

    const payload: IJWT = {
      user_id: user.user_id,
      email: user.email,
    };

    const accessToken = this.generateToken(payload);

    return accessToken;
  }
}
