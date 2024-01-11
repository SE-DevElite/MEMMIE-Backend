import { UserService } from '@/repositories/users/user.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { Users } from '@/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [FollowController],
  providers: [FollowService, UserService],
})
export class FollowModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(FollowController);
  }
}
