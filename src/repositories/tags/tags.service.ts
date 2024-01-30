import { Tags } from '@/entities/tags.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Users } from '@/entities/users.entity';

@Injectable()
export class TagsService {
  constructor(private readonly userService: UserService) {}
  private createTagObject(user: Users, tag_name: string) {
    const tag = new Tags();

    tag.user = user;
    tag.tag_name = tag_name;

    return tag;
  }

  async findAllTagByUserId(user_id: string): Promise<Tags[]> {
    const res = await Tags.createQueryBuilder('tags')
      .where('tags.user_id = :user_id', { user_id })
      .select(['tags.tag_id', 'tags.tag_name'])
      .getMany();

    return res;
  }

  async createTag(user_id: string, tag_name: string): Promise<Tags> {
    const user = await this.userService.getUserById(user_id);
    if (!user) {
      return null;
    }

    const tag = this.createTagObject(user, tag_name);
    const res = await tag.save();

    return res;
  }

  async deleteTag(user_id: string, tag_id: string): Promise<Tags> {
    const tag = await Tags.createQueryBuilder('tags')
      .where('tags.user_id = :user_id', { user_id })
      .andWhere('tags.tag_id = :tag_id', { tag_id })
      .getOne();

    if (!tag) {
      return null;
    }

    const res = await tag.remove();

    if (!res) {
      return null;
    }

    return res;
  }
}
