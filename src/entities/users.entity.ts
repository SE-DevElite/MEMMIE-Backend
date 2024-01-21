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
import { FriendLists } from './friend_list.entity';
import { Tags } from './tags.entity';
import { Mentions } from './mention.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ length: 100, nullable: false })
  password: string;

  @Column({ length: 100, nullable: true, default: null })
  avatar: string;

  @Column({ length: 100, default: 'local' })
  provider: string;

  @OneToMany(() => Follows, (follows) => follows.user, {
    cascade: true,
  })
  follows: Follows[];

  @OneToMany(() => Follows, (follows) => follows.following, {
    cascade: true,
  })
  following: Follows[];

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.user_id,
    { cascade: true },
  )
  user_friend_lists: UserFriendLists[];

  @OneToMany(
    () => UserFriendLists,
    (user_friend_lists) => user_friend_lists.user_in_list,
    { cascade: true },
  )
  user_friend_lists_in_list: UserFriendLists[];

  @OneToMany(() => FriendLists, (friendlist) => friendlist.user, {
    cascade: true,
  })
  firendlist: FriendLists[];

  @OneToMany(() => Memories, (memory_card) => memory_card.user, {
    cascade: true,
  })
  memory_card: Memories[];

  @OneToMany(() => Albums, (albums) => albums.user, {
    cascade: true,
  })
  album: Albums[];

  @OneToMany(() => Tags, (tag) => tag.user, {
    cascade: true,
  })
  tag: Tags[];

  @OneToMany(() => Mentions, (mentions) => mentions.friend, {
    cascade: true,
  })
  mentions: Mentions[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
