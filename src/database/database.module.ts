import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post.entity';
import { Profile } from 'src/typeorm/entities/Profile.enitity';
import { User } from 'src/typeorm/entities/User.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow('POSTGRES_PORT'),
        database: configService.getOrThrow('POSTGRES_DB'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        // autoLoadEntities: true,
        entities: [User, Profile, Post],
        synchronize: configService.getOrThrow('POSTGRESQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
