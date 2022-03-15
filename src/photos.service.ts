import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Photo } from "./entities/photo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as path from "path";

import { v4 as uuid } from "uuid";
import { rm } from "fs/promises";
import { ClientProxy } from "@nestjs/microservices";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Response } from "express";

const fs = require("fs");


@Injectable()
export class PhotosService {

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @Inject("ARTICLES") private readonly articlesClient: ClientProxy
  ) {
  }
  async sendPhoto(files) {
    const photoName = files[0].originalname;
    const buffer = files[0].buffer;
    const uuidPath = uuid();

    //create dir with uuid
    const dir = `./uploads/files/${uuidPath}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    //save file.png in uuid folder created above
    await fs.appendFileSync(`./uploads/files/${uuidPath}/${photoName}`, Buffer.from(buffer));

    // save file data in photo table
    const fullPath = `.\\uploads\\files\\${uuidPath}\\${photoName}`;

    //save in data base
    const newRecipe = await this.photoRepository.create({
      fullPath,
      photoName
    });
    const createPhoto = await this.photoRepository.save(newRecipe);

    return createPhoto;
  }

  async downloadPhoto(id: number, res: Response) {
    const photo = await this.photoRepository.findOne({ where: { id } });

    if (photo === undefined) {
      throw new NotFoundException(`Photo with id #${id} was not found`);
    }

    const pathToDownloadPhoto = path.join(__dirname, "..", `${photo.fullPath}`);

    res.download(pathToDownloadPhoto);
  }

  async _updatePhoto(id, files) {
    const photo = await this.photoRepository.findOne(id);
    const buffer = files[0].buffer;

    const oldPath = photo.fullPath.split("\\");
    const newPath = path.join(`./+${oldPath[0]}`, `${oldPath[1]}`, `${oldPath[2]}`, `${oldPath[3]}`, `${files[0].originalname}`).substring(1);
    const removePath = path.join(`./+${oldPath[0]}`, oldPath[1], oldPath[2], oldPath[3], "").substring(1);
    console.log(removePath);

    // remove old dir
    console.log("first exists", existsSync(removePath));
    if (existsSync(removePath)) {
      await rm(removePath, { recursive: true });
    }

    //make new dir withe old name
    console.log("second exists", existsSync(removePath));
    if (!existsSync(removePath)) {
      mkdirSync(removePath, { recursive: true });
    }

    // // add new updated photo to dir
    await writeFileSync(newPath, Buffer.from(buffer));


    // //update file name to new file name and fullPath to newPath in database
    const check = await this.photoRepository.createQueryBuilder()
      .update()
      .set({
        photoName: files[0].originalname,
        fullPath: newPath
      })
      .where({ id })
      .execute();

    //@TODO ładna wiadomość zwrotna
    return true;
  }

  async deletePhoto(id) {
    const photo = await this.photoRepository.findOne(id);
    if (photo === undefined) {
      throw new NotFoundException(`Photo with id #${id} was not found`);
    }
    const photoUuid = photo.fullPath.split("\\")[3];
    const pathToDeletePhoto = `./uploads/files/${photoUuid}`;

    if (existsSync(pathToDeletePhoto)) {
      await rm(pathToDeletePhoto, {
        recursive: true
      });
    }
    return this.photoRepository.remove(photo);
  }
}
