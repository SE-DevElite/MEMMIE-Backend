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
import { Memories } from './memory_card.entity';

@Entity()
export class FriendLists extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  friend_list_id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.friend_list_id,
    { cascade: true },
  )
  user_friend_lists: UserFriendLists[];

  @OneToMany(() => Memories, (memories_card) => memories_card.friend_list)
  memories: Memories[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
