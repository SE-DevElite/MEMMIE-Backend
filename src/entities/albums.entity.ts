import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    BaseEntity,
    JoinColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
  } from 'typeorm';
  import { Users } from './users.entity';
  import { Memmorys } from './memory_card.entity';

  @Entity()
  export class Albums extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    album_id: string;
  
    @ManyToOne(() => Users, (user) => user.album_id)
    @JoinColumn({ name: 'user_id' })
    user_id: Users;
    
    @ManyToOne(() => Memmorys, (memory) => memory.albums)
    @JoinColumn({ name: 'memory_id'})
    memory_id: Memmorys;

    @Column({ length: 100, nullable: false })
    album_name: string;
  
    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
    created_at: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

  }
  