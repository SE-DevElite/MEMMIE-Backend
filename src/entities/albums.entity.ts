import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Users } from './users.entity';
import { Memories } from './memory_card.entity';

@Entity()
export class Albums extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  album_id: string;

  @ManyToOne(() => Users, (user) => user.album_id)
  @JoinColumn({ name: 'user_id' })
  user_id: Users;

  @ManyToMany(() => Memories)
  @JoinTable()
  memory_id: Memories;

  @Column({ length: 100, nullable: false })
  album_name: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
