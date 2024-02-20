import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@/entities/users.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async searchUsers(query: string): Promise<Users[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query OR user.interests ILIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }
}
