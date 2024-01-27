import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { FriendLists } from './friend_list.entity';
import { Users } from './users.entity';

@Entity()
export class UserFriendLists extends BaseEntity {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  user_in_list: number;

  @PrimaryColumn()
  friend_list_id: number;

  @ManyToOne(() => Users, (user) => user.user_friend_lists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Users, (user) => user.user_friend_lists_in_list, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_in_list' })
  userInList: Users;

  @ManyToOne(
    () => FriendLists,
    (friend_list) => friend_list.user_friend_lists,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'friend_list_id' })
  friendList: FriendLists;
}
