import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TagAlbums } from './tag_album.entity';
import { Users } from './users.entity';

@Entity()
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  tag_id: string;

  @Column({ type: 'varchar', length: 100 })
  tag_name: string;

  @OneToMany(() => TagAlbums, (tagAlbums) => tagAlbums.tag, {
    cascade: true,
  })
  tag_albums: TagAlbums[];

  @ManyToOne(() => Users, (user) => user.tag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
