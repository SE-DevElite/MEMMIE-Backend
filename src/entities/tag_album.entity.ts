import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tags } from './tags.entity';
import { Albums } from './albums.entity';

@Entity()
export class TagAlbums extends BaseEntity {
  @PrimaryColumn()
  tag_id: string;

  @PrimaryColumn()
  album_id: string;

  @ManyToOne(() => Tags, (tags) => tags.tag_albums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tags;

  @ManyToOne(() => Albums, (albums) => albums.tag_albums, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: Albums;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
