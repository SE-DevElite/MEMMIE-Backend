import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './repositories/users/user.module';
import { AuthModule } from './repositories/auth/auth.module';
import { FollowModule } from './repositories/follows/follow.module';
import { UploadModule } from './repositories/uploads/upload.module';
import { AlbumModule } from './repositories/albums/album.module';
import { FriendlistModule } from './repositories/friendlists/friendlist.module';
import { MemoryModule } from './repositories/memory/memory.module';
import { TagsModule } from './repositories/tags/tags.module';
import { MentionsModule } from './repositories/mentions/mentions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    FollowModule,
    UploadModule,
    AlbumModule,
    FriendlistModule,
    MemoryModule,
    TagsModule,
    MentionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
