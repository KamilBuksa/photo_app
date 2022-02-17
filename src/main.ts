import { NestFactory } from '@nestjs/core';
import {PhotosModule} from "./photos.module";
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(PhotosModule);
  // test

  app.connectMicroservice({
    transport:Transport.TCP,
    options:{
      port:3001
    }
  })
  await app.startAllMicroservices()

  await app.listen(3001)

  // test
  // await app.listen(3000);
}
bootstrap();
