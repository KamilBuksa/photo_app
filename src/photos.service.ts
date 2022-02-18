import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Photo} from "./entities/photo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as path from "path";
import {CreateUserEvent} from "./create-user-event";
import {CreatePhotoDto} from "./dto/create-photo.dto";
import * as fs from "fs";
// import fs from "fs";
const {mkdir, writeFile} = require('fs').promises;
import {v4 as uuid} from 'uuid';

@Injectable()
export class PhotosService {
    private ar: any[] = []

    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>
    ) {
    }

    handleUserCreated(data) {

        console.log('handlerUserCreated - PHOTOS', data);
        this.ar.push(data)

    }

    // take photo and save in uploads/files
    //@TODO add UUID:v4 to photo upload path dir like:  uploads/files/uuid/3.png  and return UUID
    async getPhotoMessage(buffer, fileName, articleId) {
        console.log('message DZIAŁA')
        const uuidPath = uuid()
        console.log(uuidPath)
        console.log('fileName', fileName)
        //create dir with uuidPath name

        //create dir with uuid
        const fs = require('fs');
        const dir = `./uploads/files/${uuidPath}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
//save file.png in uuid folder created above
        fs.appendFileSync(`./uploads/files/${uuidPath}/${fileName}`, Buffer.from(buffer));

        const pathToFile = path.join(__dirname, '..', 'uploads', `${uuidPath}`, `${fileName}`);
        const photoName = fileName
        const fullPath = `./uploads/files/${uuidPath}/${fileName}`


        //save in data base
        const newRecipe = await this.photoRepository.create({
            fullPath,
            photoName,
            articleId

        })
        await this.photoRepository.save(newRecipe)

        return {
            uuid: uuidPath,
            filePath: fullPath
        }
    }


    async uploadFile(photo: string) {
    }

    async downloadFile(req, res, next) {

    }

}
