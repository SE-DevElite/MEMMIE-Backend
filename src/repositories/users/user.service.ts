import { Users } from '@/entities/users.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private async createUser(email: string, password: string) {
    const user = new Users();
    const bcrypt_password = await bcrypt.hash(password, 10);

    user.email = email;
    user.password = bcrypt_password;
    return user;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const res = await Users.findOne({ where: { email } });

    return res;
  }

  async createUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    const user = await this.createUser(email, password);
    const res = await user.save();

    return res;
  }
}
