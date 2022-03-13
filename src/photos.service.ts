import {Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Photo} from "./entities/photo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as path from "path";

import {v4 as uuid} from 'uuid';
import {rm} from "fs/promises";
import {ClientProxy} from "@nestjs/microservices";
import {existsSync, mkdirSync, writeFileSync} from "fs";

const fs = require('fs');


@Injectable()
export class PhotosService {

    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
        @Inject('ARTICLES') private readonly articlesClient: ClientProxy
    ) {
    }



    // save photo
    async savePhoto(buffer, fileName:string, articleId:number) {
        console.log(buffer)
        console.log(fileName)

        console.log('message DZIAŁA')
        const uuidPath = uuid()

        //create dir with uuid
        const dir = `./uploads/files/${uuidPath}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        //save file.png in uuid folder created above
        await fs.appendFileSync(`./uploads/files/${uuidPath}/${fileName}`, Buffer.from(buffer));

        // save file data in photo table
        const photoName = fileName
        const fullPath = `.\\uploads\\files\\${uuidPath}\\${fileName}`
        console.log(fullPath)


        //save in data base
        const newRecipe = await this.photoRepository.create({
            fullPath,
            photoName,
        })
        const createPhoto = await this.photoRepository.save(newRecipe);
        const photoId = createPhoto.id;


        //send data photoId to article.service
        this.articlesClient.emit({cmd: 'add_photoId'}, {photoId, articleId});

        return {
            uuid: uuidPath,
            filePath: fullPath
        }
    }




    async deletePhotoMessage(photoId:number) {
        const photo = await this.photoRepository.findOne({id: photoId});

        const photoUuid = photo.fullPath.split('\\')[3];
        const pathToDeletePhoto = `./uploads/files/${photoUuid}`
        console.log(photoId);
        console.log(pathToDeletePhoto);
        if (existsSync(pathToDeletePhoto)) {
            await rm(pathToDeletePhoto, {
                recursive: true,
            });
        }
        return this.photoRepository.remove(photo);


    }


    async downloadPhotoMessage(body:{ photoId: number },) {
        console.log('downloadPhotoMessage', body)
        const findPhoto = await this.photoRepository.findOne({where: {id: body.photoId}});
        console.log(findPhoto)
        const pathToDownloadPhoto = path.join(__dirname, '..', `${findPhoto.fullPath}`);
        console.log('weszło')

        //wysłanie scieżki do apki article
        return this.articlesClient.emit({cmd: 'download_photo2'}, {pathToDownloadPhoto});
    }


    async updatePhotoMessage(buffer:any, fileName:string, photoId:number) {
        console.log(    buffer)
        console.log( buffer instanceof Buffer)
        console.log(typeof fileName)
        console.log(typeof photoId)


        const findRow = await this.photoRepository.findOne({id: photoId});

        const oldPath = findRow.fullPath.split('\\')
        const newPath = path.join(`./+${oldPath[0]}`, `${oldPath[1]}`, `${oldPath[2]}`, `${oldPath[3]}`, `${fileName}`).substring(1)
        const removePath = path.join(`./+${oldPath[0]}`, oldPath[1], oldPath[2], oldPath[3], '').substring(1)

        //remove old dir
        console.log('first exists', existsSync(removePath))
        if (existsSync(removePath)) {
            await rm(removePath, {recursive: true});
        }

        //make new dir withe old name
        console.log('second exists', existsSync(removePath))
        if (!existsSync(removePath)) {
            mkdirSync(removePath, {recursive: true});
        }

        // add new updated photo to dir
        await writeFileSync(newPath, Buffer.from(buffer));

        //update file name to new file name and fullPath to newPath in database
        const check = await this.photoRepository.createQueryBuilder()
            .update()
            .set({
                photoName: fileName,
                fullPath: newPath
            })
            .where({id: photoId})
            .execute()

        console.log(check)

        return true
    }


}
