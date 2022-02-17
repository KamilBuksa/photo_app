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

    // take photo and save in uploads/files
    //@TODO add UUID:v4 to photo upload path dir like:  uploads/files/uuid/3.png  and return UUID
   async getPhotoMessage(buffer){
        console.log('message DZIAŁA')
       fs.appendFileSync(`uploads/files/3.png`, Buffer.from(buffer));
    }



   async uploadFile(photo:string) {
   }

    async downloadFile  (req, res, next)  {

    }

}
