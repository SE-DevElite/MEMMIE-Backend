import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Follows } from './follows.entity';
import { Memories } from './memory_card.entity';
import { Albums } from './albums.entity';
import { Exclude } from 'class-transformer';
import { FriendLists } from './friend_list.entity';

export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false })
  username: string;

  @Column({ length: 300, nullable: true, default: null })
  bio: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.OTHER,
  })
  gender: GenderEnum;

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
  albums: Albums[];

  @ManyToMany(() => FriendLists, (friendlist) => friendlist.friend_id, {
    cascade: true,
  })
  user_friend_lists: FriendLists[];

  @ManyToMany(() => Memories, (memory_card) => memory_card.mentions, {
    cascade: true,
  })
  mention_friend_id: Memories[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
