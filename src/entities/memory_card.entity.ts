import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Users } from './users.entity';
import { FriendLists } from './friend_list.entity';
import { MemoryList } from './memory_list.entity';
import { Albums } from './albums.entity';

export enum MoodEnum {
  HAPPY = 'happy',
  SAD = 'sad',
  NAH = 'nah',
  FUNNY = 'funny',
}

export enum WeatherEnum {
  CLOUDY = 'cloudy',
  CLEARSKY = 'clearsky',
  DOWNPOUR = 'downpour',
  SNOWFLAKE = 'snowflake',
  SUNNY = 'sunny',
}

export enum DayEnum {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum PrivacyEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
  GENERAL = 'general',
}

@Entity()
export class Memories extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  memory_id: string;

  @Column({
    type: 'enum',
    enum: MoodEnum,
    default: MoodEnum.NAH,
  })
  mood: MoodEnum;

  @Column({
    type: 'enum',
    enum: WeatherEnum,
    default: WeatherEnum.SUNNY,
  })
  weather: WeatherEnum;

  @Column({
    type: 'enum',
    enum: DayEnum,
  })
  day: DayEnum;

  @Column({ length: 100, nullable: true, default: null })
  location_name: string;

  @Column({ length: 100, nullable: false })
  selected_datetime: string;

  @Column({ length: 100, nullable: true })
  lat: string;

  @Column({ length: 100, nullable: true })
  long: string;

  @Column({ length: 10_000 })
  caption: string;

  @Column({
    type: 'enum',
    enum: PrivacyEnum,
    default: PrivacyEnum.PRIVATE,
  })
  privacy: PrivacyEnum;

  @Column({ length: 1000 })
  short_caption: string;

  @ManyToMany(() => Albums, (albums) => albums.memories, {
    cascade: true,
  })
  albums: Albums[];

  @ManyToOne(() => Users, (user) => user.memory_card)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => FriendLists, (friend_list) => friend_list.memories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'friend_list_id' })
  friend_list?: FriendLists;

  @OneToMany(() => MemoryList, (memory_list) => memory_list.memory, {
    cascade: true,
  })
  memory_lists: MemoryList[];

  @ManyToMany(() => Users, (user) => user.mention_friend_id)
  @JoinTable({
    name: 'mentions',
    joinColumn: {
      name: 'memory_id',
      referencedColumnName: 'memory_id',
    },
    inverseJoinColumn: {
      name: 'friend_id',
      referencedColumnName: 'user_id',
    },
  })
  mentions: Users[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  updated_at: Date;
}
