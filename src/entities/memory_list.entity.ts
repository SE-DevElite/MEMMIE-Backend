import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Memories } from './memory_card.entity';

@Entity()
export class MemoryList extends BaseEntity {
  @PrimaryColumn()
  memory_id: string;

  @ManyToOne(() => Memories, (memories) => memories.memory_lists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memory_id' })
  memory: Memories;
}
