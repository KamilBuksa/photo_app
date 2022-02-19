import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Photo} from "./entities/photo.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as path from "path";
import {CreatePhotoDto} from "./dto/create-photo.dto";
import * as fs from "fs";
// import fs from "fs";
const {mkdir, writeFile} = require('fs').promises;
import {v4 as uuid} from 'uuid';
import {rm} from "fs/promises";
import {Response} from "express";
// import * as http from "http";
const http = require('http');


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

        //create dir with uuid
        const fs = require('fs');
        const dir = `./uploads/files/${articleId}ar-${uuidPath}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        //save file.png in uuid folder created above
        fs.appendFileSync(`./uploads/files/${articleId}ar-${uuidPath}/${fileName}`, Buffer.from(buffer));

        // const pathToFile = path.join(__dirname, '..', 'uploads', `${uuidPath}`, `${fileName}`);
        const photoName = fileName
        const fullPath = `./uploads/files/${articleId}ar-${uuidPath}/${fileName}`
        const photoIndex = `./uploads/files/${articleId}ar-${uuidPath}`
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

    async deletePhotoMessage(body) {
        console.log('deletePhotoMessage', body.id)
        const photo = await this.photoRepository.findOne({where: {articleId: body.id}});

        //remove photo dir, pierwsz cyfra uuid to Id artykułu np. "7ar-uuid"
        const photoUuid = photo.fullPath.split('/')[3];
        const pathToDeletePhoto = `./uploads/files/${photoUuid}`
        await rm(pathToDeletePhoto, {
            recursive: true,
        });


        console.log('PHOTOOOOOO', photo)
        return this.photoRepository.remove(photo);


    }


    async downloadPhotoMessage(body, ) {

        console.log('downloadPhotoMessage', body)
        const findPhoto = await this.photoRepository.findOne({where: {articleId: body.id}});
        const pathToDownloadPhoto = path.join(__dirname, '..', `${findPhoto.fullPath}`);


        // const file = fs.createWriteStream("file.jpg");
        // const request = http.get(pathToDownloadPhoto, function(response) {
        //     response.pipe(file);
        // });
       // return res.download(pathToDownloadPhoto)
    }

    async uploadFile(photo: string) {
    }

    async downloadFile(req, res, next) {

    }

}
