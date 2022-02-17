import {Body, Controller, Delete, Get, Param, Post, } from '@nestjs/common';
import {PhotosService} from "./photos.service";
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {CreateUserEvent} from "./create-user-event";
import {CreatePhotoDto} from "./dto/create-photo.dto";
// import {PhotosService} from "./photos.service";

@Controller()
export class PhotosController {
    constructor(
        private readonly photosService:PhotosService
    ) {
        this.log()
    //    article data
    }
    @EventPattern('user_created')
    handleUserCreated(data) {
        console.log('data')
        this.photosService.handleUserCreated(data);
    }
log(){
    console.log('tutaj wywołanie requsta z article')
}
    @MessagePattern({ cmd: 'get_photos' })
    getPhotoMessage(@Body() body) {
        // console.log(body.fileData.buffer.data)
        // console.log('weszło')
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
