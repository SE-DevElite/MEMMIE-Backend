import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Follows extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  follow_id: string;

  @ManyToOne(() => Users, (user) => user.follows)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToOne(() => Users, (user) => user.following)
  @JoinColumn({ name: 'following_id' })
  following: Users;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;
}
