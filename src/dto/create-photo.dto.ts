import {IsNumber, IsString} from "class-validator";

export class CreatePhotoDto {

    // createdAt: Date,
    // @IsString()
    // fullPath: String
    //
    // @IsString()
    // photoIndex: String
    //
    // @IsString()
    // photoName: String


    @IsString()
    fullPath: String

    @IsString()
    photoName: String

    @IsNumber()
    articleId:number

}
