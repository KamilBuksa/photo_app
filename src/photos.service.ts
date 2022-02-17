import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {Photo} from "./entities/photo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import path from "path";
import {CreateUserEvent} from "./create-user-event";
import {CreatePhotoDto} from "./dto/create-photo.dto";
import * as fs from "fs";
// import fs from "fs";
const { mkdir, writeFile } = require('fs').promises;

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository:Repository<Photo>
    ) {}

    handleUserCreated(data) {
        console.log('handlerUserCreated - PHOTOS', data);


    }

   async getPhotoMessage(buffer){

        console.log('message DZIAŁA')
        console.log( buffer)
        // fs.writeFileSync(
        //     `uploads/files/1`, buffer)

       fs.appendFileSync(`uploads/files/3.png`, Buffer.from(buffer));
      // await  writeFile(
      //       `uploads/files/3.png`, `<Buffer ${buffer}>`, {
      //           encoding: '7bit',
      //     })

    }



   async uploadFile(photo:string) {
   }

    async downloadFile  (req, res, next)  {

    }

}
