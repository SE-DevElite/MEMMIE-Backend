import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Memories } from './memory_card.entity';
import { Users } from './users.entity';

@Entity()
export class Mentions extends BaseEntity {
  @PrimaryColumn()
  memory_id: string;

  @PrimaryColumn()
  friend_id: string;

  @ManyToOne(() => Memories, (memories) => memories.mentions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memory_id' })
  memory: Memories;

  @ManyToOne(() => Users, (users) => users.mentions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'friend_id' })
  friend: Users;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
