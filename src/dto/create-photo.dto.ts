import {IsString} from "class-validator";

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
    email: string

    @IsString()
    password:string

}
