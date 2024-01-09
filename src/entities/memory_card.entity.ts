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
    OneToMany,
  } from 'typeorm';
  import { Users } from './users.entity';
  import { Albums } from './albums.entity';
  
  
  @Entity()
  export class Memmorys extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    memory_id: string;
  
    @ManyToOne(() => Users, (user) => user.memory_card)
    @JoinColumn({ name: 'user_id' })
    user_id: Users;
    
    @Column({ length: 100, nullable: false })
    email: string;
  
    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
    created_at: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;

    @Column({ length: 100 })
    caption: string;

    @Column({ length: 100 })
    short_caption: string;

    @OneToMany(() => Albums, (albums) => albums.memory_id)
    albums: Albums[]


  }
  