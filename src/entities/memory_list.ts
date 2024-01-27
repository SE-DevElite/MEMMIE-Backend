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

  @ManyToOne(() => Memories, (memory) => memory.memory_list, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'memory_id' })
  memory: MemoryList;
}
