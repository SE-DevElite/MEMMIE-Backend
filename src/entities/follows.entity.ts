import {
  Entity,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Follows extends BaseEntity {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  following_id: string;

  @ManyToOne(() => Users, (user) => user.follows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Users, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  following: Users;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;
}
