import {Body, Controller, Delete, Get, Param, Post, Req, Res,} from '@nestjs/common';
import {PhotosService} from "./photos.service";
import { MessagePattern} from "@nestjs/microservices";


@Controller()
export class PhotosController {
    constructor(
        private readonly photosService: PhotosService
    ) {}



//odbierz ładunek od sharezone i zapisz zdjęcie
    @MessagePattern({cmd: 'get_photos'})
    async getPhotoMessage(
        //validation to body is exeuted in sharezone app
        @Body() body,
    ) {
        console.log(body)
        return this.photosService.getPhotoMessage(body.fileData.buffer.data, body.fileData.originalname, body.articleId);
    }

    // Odbierz ładunek i zapisz zdjęcie, przekaż photoId do tabeli article
    @MessagePattern({cmd:'save_photo'})
    async savePhoto (
        @Body() body,
    ){
        console.log(body)
        return this.photosService.savePhoto(body.fileData.buffer.data, body.fileData.originalname, body.articleId)
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



}
