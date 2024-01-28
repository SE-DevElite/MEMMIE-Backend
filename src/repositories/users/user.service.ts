import { GenderEnum, Users } from '@/entities/users.entity';
import { BodyUserDto } from '@/interfaces/IUserRequest';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private async createUser(
    email: string,
    password: string,
    provider: string,
    name?: string,
    picture?: string,
    username?: string,
    gender?: GenderEnum,
    bio?: string,
  ) {
    const user = new Users();
    const bcrypt_password = await bcrypt.hash(password, 10);

    user.email = email;
    user.password = bcrypt_password;
    user.provider = provider;

    user.name = name;
    user.avatar = picture;
    user.username = username;
    user.bio = bio || null;
    user.gender = gender;

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
    const res = await Users.findOne({
      where: { user_id },
      relations: ['follows', 'albums'],
    });
    return res;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const res = await Users.findOne({ where: { email } });
    return res;
  }

  async getUserProfile(user_id: string): Promise<Users> {
    const res = await Users.createQueryBuilder('users')
      .where('users.user_id = :user_id', { user_id })
      .leftJoinAndSelect('users.follows', 'follows')
      .leftJoinAndSelect('users.albums', 'albums')
      .leftJoinAndSelect('albums.tags', 'tags')
      .getOne();

    return res;
  }

  async createUserByEmailAndPassword(
    email: string,
    password: string,
    provider: string,
    name: string,
    picture: string,
    username: string,
    gender: GenderEnum,
  ): Promise<Users> {
    const user = await this.createUser(
      email,
      password,
      provider,
      name,
      picture,
      username,
      gender,
    );
    const res = await user.save();

    return res;
  }

  async updateUser(user_id: string, req: BodyUserDto): Promise<Users> {
    const res = await Users.update(
      { user_id },
      {
        bio: req.bio,
        name: req.name,
        username: req.username,
        gender: req.gender as GenderEnum,
      },
    );

    return res.raw[0];
  }
}
