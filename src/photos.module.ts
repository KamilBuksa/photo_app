import { Module } from '@nestjs/common';
import {PhotosService} from "./photos.service";
import {PhotosController} from "./photos.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Photo} from "./entities/photo.entity";
import {ConfigModule, ConfigService} from "@nestjs/config";
import appConfig from './config/app.config';
import {Transport} from "@nestjs/microservices";

@Module({
  imports:[
    ConfigModule.forRoot({
      load: [appConfig], // 👈
    }),
      TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forRootAsync({ // 👈
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
        // entities:[Photo]
      }),
    })

  ],
  controllers: [PhotosController,],
  providers: [PhotosService,],
  exports: []
})
export class PhotosModule {}


