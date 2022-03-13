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


    // take photo and save in uploads/files
    async getPhotoMessage(buffer, fileName, articleId) {
        console.log('message DZIAŁA')
        const uuidPath = uuid()

        //create dir with uuid
        const dir = `./uploads/files/${articleId}ar-${uuidPath}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        //save file.png in uuid folder created above
        await fs.appendFileSync(`./uploads/files/${articleId}ar-${uuidPath}/${fileName}`, Buffer.from(buffer));

        // const pathToFile = path.join(__dirname, '..', 'uploads', `${uuidPath}`, `${fileName}`);
        const photoName = fileName
        const fullPath = `.\\uploads\\files\\${articleId}ar-${uuidPath}\\${fileName}`
        console.log(fullPath)


        //save in data base
        const newRecipe = await this.photoRepository.create({
            fullPath,
            photoName,
            articleId,

        })
        await this.photoRepository.save(newRecipe)

        return {
            uuid: uuidPath,
            filePath: fullPath
        }
    }


    // save photo
    async savePhoto(buffer, fileName, articleId) {
        console.log(buffer)
        console.log(fileName)

        console.log('message DZIAŁA')
        const uuidPath = uuid()

        //create dir with uuid
        const dir = `./uploadsTEST/files/${uuidPath}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        //save file.png in uuid folder created above
        await fs.appendFileSync(`./uploadsTEST/files/${uuidPath}/${fileName}`, Buffer.from(buffer));

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


    async deletePhotoMessage(body) {
        if (await this.photoRepository.findOne({where: {articleId: body.id}})) {
            console.log('deletePhotoMessage', body.id)
            const photo = await this.photoRepository.findOne({where: {articleId: body.id}});

            //remove photo dir, pierwsz cyfra uuid to Id artykułu np. "7ar-uuid"
            const photoUuid = photo.fullPath.split('\\')[3];
            const pathToDeletePhoto = `./uploads/files/${photoUuid}`

            if (existsSync(pathToDeletePhoto)) {
                await rm(pathToDeletePhoto, {
                    recursive: true,
                });
            }
            return this.photoRepository.remove(photo);
        } else {
            return undefined
        }
    }


    async downloadPhotoMessage(body,) {
        console.log('downloadPhotoMessage', body)
        const findPhoto = await this.photoRepository.findOne({where: {articleId: body.id}});
        const pathToDownloadPhoto = path.join(__dirname, '..', `${findPhoto.fullPath}`);
        console.log('weszło')

        //wysłanie scieżki do apki article
        return this.articlesClient.emit({cmd: 'download_photo2'}, {pathToDownloadPhoto});
    }


    async updatePhotoMessage(buffer, fileName, id) {

        const findRow = await this.photoRepository.findOne({articleId: id});

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
            .where({articleId: id})
            .execute()

        console.log(check)

        return true
    }


}
