import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Memories } from './memory_card.entity';
import { Users } from './users.entity';

@Entity()
export class FriendLists extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  friend_list_id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @ManyToOne(() => Users, (users) => users.firendlist, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToMany(() => Users, (users) => users.user_friend_lists)
  @JoinTable({
    name: 'user_friend_lists',
    joinColumn: {
      name: 'friend_list_id',
      referencedColumnName: 'friend_list_id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'user_id',
    },
  })
  friend_id: Users[];

  @OneToMany(() => Memories, (memories_card) => memories_card.friend_list, {
    cascade: true,
  })
  memories: Memories[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
