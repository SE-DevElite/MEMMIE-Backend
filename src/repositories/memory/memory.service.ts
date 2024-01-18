import { Memories } from '@/entities/memory_card.entity';
import { Users } from '@/entities/users.entity';
import { FriendLists } from '@/entities/friend_list.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemoryService {
    constructor(
        @InjectRepository(Memories)
        private readonly memoriesRepository: Repository<Memories>,
        private readonly usersService: UserService,
      ) {}

    
    private async createMemory(
        memory_id: string,
        user_id: Users,
        email: string,
        caption: string,
        short_caption: string,
        friend_list: FriendLists
    ) {
        const memory = new Memories();
        memory.memory_id = memory_id;
        memory.user_id = user_id;
        memory.email = email;
        memory.caption = caption;
        memory.short_caption = short_caption;
        memory.friend_list = friend_list;
        return memory;
      }
    
      async getMemoryById(memory_id: string): Promise<Memories> {
        const res = await Memories.findOne({where: { memory_id }});
        return res;
      }

      //constructor(private usersService: UserService) {}

        async createMemoryById(
            memory_id: string,
            user_id: string,
            email: string,
            caption: string,
            short_caption: string,
            friend_list: FriendLists
        ): Promise<Memories> { 
            
            const user = await this.usersService.getUserById(user_id);
            const memory = await this.createMemory(
                memory_id,
                user,
                email,
                caption,
                short_caption,
                friend_list
            );
           
            const res = await memory.save();
        
            return res;
        }
        
        async updateMemoryById(
            memory_id: string,
            user_id: string,
            email: string,
            caption: string,
            short_caption: string,
            friend_list: FriendLists,
          ): Promise<Memories | null> {
            
            const user = await this.usersService.getUserById(user_id);

            if (!user) {
                return null;
            }

            const existingMemory = await this.memoriesRepository.findOne({ where: { memory_id } });

            if (!existingMemory) {
                return null;
            }

            existingMemory.user_id = user;
            existingMemory.email = email;
            existingMemory.caption = caption;
            existingMemory.short_caption = short_caption;
            existingMemory.friend_list = friend_list;

            const updatedMemory = await this.memoriesRepository.save(existingMemory);

            return updatedMemory;
        }
    }

    


   