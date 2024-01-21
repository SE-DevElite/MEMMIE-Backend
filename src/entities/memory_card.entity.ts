import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { FriendLists } from './friend_list.entity';
import { Mentions } from './mention.entity';

@Entity()
export class Memories extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  memory_id: string;

  @Column({ length: 100, nullable: true })
  memory_image: string;

  @ManyToOne(() => Users, (user) => user.memory_card, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Mentions, (mentions) => mentions.memory, {
    cascade: true,
  })
  mentions: Mentions[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;

  @Column({ length: 100 })
  caption: string;

  @Column({ length: 100 })
  short_caption: string;

  @ManyToOne(() => FriendLists, (friend_list) => friend_list.memories)
  @JoinColumn({ name: 'friend_list_id' })
  friend_list: FriendLists;
}
