import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Follows } from './follows.entity';
import { UserFriendLists } from './user_friend_list.entity';
import { Memories } from './memory_card.entity';
import { Albums } from './albums.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ length: 100, nullable: false, select: false })
  password: string;

  @OneToMany(() => Follows, (follows) => follows.user_id)
  follows: Follows[];

  @OneToMany(() => Follows, (follows) => follows.following)
  following: Follows[];

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.user_id,
  )
  user_friend_lists: UserFriendLists[];

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.user_in_list,
  )
  user_friend_lists_in_list: UserFriendLists[];

  @OneToMany(() => Memories, (memory_card) => memory_card.user_id)
  memory_card: Memories[];

  @OneToMany(() => Albums, (albums) => albums.user_id)
  album_id: Albums[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
