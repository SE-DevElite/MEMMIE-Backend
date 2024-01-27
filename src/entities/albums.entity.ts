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
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { Memories } from './memory_card.entity';
import { TagAlbums } from './tag_album.entity';

@Entity()
export class Albums extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  album_id: string;

  @ManyToOne(() => Users, (user) => user.album, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => TagAlbums, (tagAlbums) => tagAlbums.album, {
    cascade: true,
  })
  tag_albums: TagAlbums[];

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
