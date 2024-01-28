import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Albums } from './albums.entity';

@Entity()
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  tag_id: string;

  @Column({ type: 'varchar', length: 100 })
  tag_name: string;

  @ManyToMany(() => Albums, (albums) => albums.tags)
  albums: Albums[];

  @ManyToOne(() => Users, (user) => user.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
