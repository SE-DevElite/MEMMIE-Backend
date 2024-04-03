import { GenderEnum, Users } from '@/entities/users.entity';
import { BodyUserDto } from '@/interfaces/IUserRequest';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AWSService } from '../aws/aws.service';
import { Memories } from '@/entities/memory_card.entity';
import { QueryParamsUserDto } from './dto/get-users';

@Injectable()
export class UserService {
  constructor(private awsService: AWSService) {}

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

  async getUsers(query: QueryParamsUserDto): Promise<Users[]> {
    const res = await Users.find({
      where: [{ email: query.email }, { username: query.username }].filter(
        (v) => v,
      ),
    });
    return res;
  }

  async getUserById(user_id: string): Promise<Users> {
    const res = await Users.findOne({
      where: { user_id },
      relations: ['follows', 'albums'],
    });
    return res;
  }

  async findManyUsersByIds(user_ids: string[]): Promise<Users[]> {
    const res = await Users.createQueryBuilder('users')
      .where('users.user_id IN (:...user_ids)', { user_ids })
      .getMany();

    return res;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const res = await Users.findOne({ where: { email } });
    return res;
  }

  async getUserMemoryStreak(user_id: string): Promise<number> {
    const memories = await Memories.createQueryBuilder('memories')
      .where('memories.user_id = :user_id', { user_id })
      .orderBy('memories.created_at', 'DESC')
      .getMany();

    let streak = 0;
    let prevDate = new Date();
    let prev_recv = false;
    for (const memory of memories) {
      const date = new Date(memory.created_at);

      if (prevDate.getDate() === date.getDate() && !prev_recv) {
        streak++;
        prev_recv = true;
      } else if (prevDate.getDate() - date.getDate() === 1) {
        streak++;
      } else {
        break;
      }
      prevDate = date;
    }

    return streak;
  }

  async getUserProfile(user_id: string): Promise<{
    user: Users;
    streak: number;
  }> {
    const res = await Users.createQueryBuilder('users')
      .where('users.user_id = :user_id', { user_id })
      .leftJoinAndSelect('users.albums', 'albums')
      .leftJoinAndSelect('albums.memories', 'memories')
      .leftJoinAndSelect('memories.memory_lists', 'memory_lists')
      .orderBy('memories.created_at', 'DESC')
      .orderBy('memory_lists.created_at', 'DESC')
      .getOne();

    const streak = res ? await this.getUserMemoryStreak(user_id) : 0;

    if (res) {
      for (const album of res.albums) {
        if (!album.memories.length) {
          continue;
        }

        const url = await this.awsService.s3_getObject(
          process.env.BUCKET_NAME,
          album.memories[0].memory_lists[0].memory_url,
        );
        album.album_thumbnail = url;

        album.memories = album.memories
          .length as unknown as typeof album.memories;
      }
    }

    return {
      user: res,
      streak: streak,
    };
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
