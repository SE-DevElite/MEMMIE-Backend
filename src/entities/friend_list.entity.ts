import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserFriendLists } from './user_friend_list.entity';

@Entity()
export class FriendLists extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  friend_list_id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.friend_list_id,
  )
  user_friend_lists: UserFriendLists[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
