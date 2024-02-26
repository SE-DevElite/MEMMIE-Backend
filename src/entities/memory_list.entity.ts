import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Memories } from './memory_card.entity';

@Entity()
export class MemoryList extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  memory_list_id: string;

  @ManyToOne(() => Memories, (memories) => memories.memory_lists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memory_id' })
  memory: Memories;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  memory_url: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', update: false })
  created_at: Date;
}
