import {
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe, Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { PhotosService } from "./photos.service";
import { ApiKeyGuard } from "./api-key.guard";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";


@Controller("photos")
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService
  ) {
  }
  @UseGuards(ApiKeyGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async sendPhoto(
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.photosService.sendPhoto(files);
  }

  @Get(":photoId")
  downloadPhoto(
    @Param("photoId", ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    return this.photosService.downloadPhoto(id, res);
  }

  @UseInterceptors(AnyFilesInterceptor())
  @Patch(":photoId")
  updatePhoto(
    @Param("photoId", ParseIntPipe) id: number,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.photosService._updatePhoto(id, files);
  }

  @Delete(":photoId")
  deletePhoto(
    @Param("photoId", ParseIntPipe) id: number
  ) {
    return this.photosService.deletePhoto(id);
  }



}
