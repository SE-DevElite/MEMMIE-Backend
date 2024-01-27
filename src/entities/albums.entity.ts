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
import { Tags } from './tags.entity';

@Entity()
export class Albums extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  album_id: string;

  @ManyToOne(() => Users, (user) => user.albums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToMany(() => Tags, (tag) => tag.albums)
  @JoinTable({
    name: 'albums_tag',
    joinColumn: {
      name: 'album_id',
      referencedColumnName: 'album_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'tag_id',
    },
  })
  tags: Tags[];

  @ManyToMany(() => Memories, (memory) => memory.albums)
  @JoinTable({
    name: 'albums_memory',
    joinColumn: {
      name: 'album_id',
      referencedColumnName: 'album_id',
    },
    inverseJoinColumn: {
      name: 'memory_id',
      referencedColumnName: 'memory_id',
    },
  })
  memories: Memories[];

  @Column({ length: 100, nullable: false })
  album_name: string;

  @Column({ length: 100, nullable: true, default: null })
  album_avatar: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
