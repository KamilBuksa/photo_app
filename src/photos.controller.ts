import {Body, Controller, Delete, Get, Param, Post, Req,} from '@nestjs/common';
import {PhotosService} from "./photos.service";
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {Request} from "express";

@Controller()
export class PhotosController {
    constructor(
        private readonly photosService:PhotosService
    ) {
        this.log()
    //    article data
    }
    @EventPattern('user_created')
    handleUserCreated(data, ) {
        this.photosService.handleUserCreated(data);
    }
log(){
    console.log('tutaj wywołanie requsta z article')
}
//odbierz ładunek od sharezone i zapisz zdjęcie
    @MessagePattern({ cmd: 'get_photos' })
    getPhotoMessage(@Body() body) {
        return this.photosService.getPhotoMessage(body.fileData.buffer.data);
    }


    @Post('files')
    uploadPhoto(){
        console.log('weszło')
    }

    @Get('download/:directoryIndex/:fileName')
    downloadPhoto(){
        console.log('weszło2')
    }

    @Delete('/delete/:directoryIndex')
    deletePhotoWithDirectory(){
        console.log('weszło3')
    }


}
