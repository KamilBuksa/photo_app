import {Body, Controller, Delete, Get, Param, Post, Req, Res,} from '@nestjs/common';
import {PhotosService} from "./photos.service";
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {Request, Response} from "express";
import * as path from "path";
import {CreatePhotoDto} from "./dto/create-photo.dto";

@Controller()
export class PhotosController {
    constructor(
        private readonly photosService: PhotosService
    ) {
        this.log()
        //    article data
    }

    @EventPattern('user_created')
    handleUserCreated(data,) {
        this.photosService.handleUserCreated(data);
    }

    log() {
        console.log('tutaj wywołanie requsta z article')
    }

//odbierz ładunek od sharezone i zapisz zdjęcie
    @MessagePattern({cmd: 'get_photos'})
    async getPhotoMessage(
        //validation to body is exeuted in sharezone app
        @Body() body,
        createPhotoDtoDto: CreatePhotoDto
    ) {
        console.log(body)
        return this.photosService.getPhotoMessage(body.fileData.buffer.data, body.fileData.originalname, body.articleId);
    }


    @Post('files')
    uploadPhoto() {
        console.log('weszło')
    }

    @Get('download/:directoryIndex/:fileName')
    downloadPhoto() {
        console.log('weszło2')
    }

    @Delete('/delete/:directoryIndex')
    deletePhotoWithDirectory() {
        console.log('weszło3')
    }


}
