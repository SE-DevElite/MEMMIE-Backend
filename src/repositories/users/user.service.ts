import { Users } from '@/entities/users.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private async createUser(email: string, password: string, provider: string) {
    const user = new Users();
    const bcrypt_password = await bcrypt.hash(password, 10);

    user.email = email;
    user.password = bcrypt_password;
    user.provider = provider;
    return user;
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hash);
    return isPasswordValid;
  }

  async getUserById(user_id: string): Promise<Users> {
    const res = await Users.findOne({ where: { user_id } });
    return res;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const res = await Users.findOne({ where: { email } });
    return res;
  }

  async createUserByEmailAndPassword(
    email: string,
    password: string,
    provider: string,
  ): Promise<Users> {
    const user = await this.createUser(email, password, provider);
    const res = await user.save();

    return res;
  }
}
