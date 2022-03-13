import {Body, Controller, Delete, Get, Param, Post, Req, Res,} from '@nestjs/common';
import {PhotosService} from "./photos.service";
import {MessagePattern} from "@nestjs/microservices";


@Controller()
export class PhotosController {
    constructor(
        private readonly photosService: PhotosService
    ) {
    }

    // Odbierz ładunek i zapisz zdjęcie, przekaż photoId do tabeli article
    @MessagePattern({cmd: 'save_photo'})
    async savePhoto(
        @Body() body: any,
    ) {
        console.log(body)
        return this.photosService.savePhoto(body.fileData.buffer.data, body.fileData.originalname, body.articleId)
    }


    @MessagePattern({cmd: 'delete_photo'})
    async deletePhotoMessage(@Body('photoId') photoId: number,
    ) {
        return this.photosService.deletePhotoMessage(photoId)
    }

    @MessagePattern({cmd: 'download_photo'})
    async downloadPhotoMessage(
        @Body() body: { photoId: number },
    ) {
        return this.photosService.downloadPhotoMessage(body)
    }

    @MessagePattern({cmd: 'update_photo'})
    updatePhotoMessage(
        @Body() body: {photoId:number, files:any}
    ) {
        console.log('BODYYY',body)
        return this.photosService.updatePhotoMessage(body.files[0].buffer.data, body.files[0].originalname, body.photoId);

    }


}
