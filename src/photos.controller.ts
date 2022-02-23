import {Body, Controller, Delete, Get, Param, Post, Req, Res,} from '@nestjs/common';
import {PhotosService} from "./photos.service";
import { MessagePattern} from "@nestjs/microservices";

import {CreatePhotoDto} from "./dto/create-photo.dto";

@Controller()
export class PhotosController {
    constructor(
        private readonly photosService: PhotosService
    ) {
        this.log()
        //    article data
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

    @MessagePattern({cmd: 'delete_photo'})
    async deletePhotoMessage(@Body() body,
    ) {
        return this.photosService.deletePhotoMessage(body)
    }

    @MessagePattern({cmd: 'download_photo'})
    async downloadPhotoMessage(@Body() body, ){
        return  this.photosService.downloadPhotoMessage(body)
    }

    @MessagePattern({cmd: 'update_photo'})
    updatePhotoMessage(@Body() body){

        return  this.photosService.updatePhotoMessage(body.files[0].buffer.data, body.files[0].originalname, body.id);

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
