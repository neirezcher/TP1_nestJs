import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { CvEntity } from "../../cv/entities/cv.entity";

export class CreateUserDto {

    @IsNotEmpty()
    username: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
     @IsStrongPassword()
    password: string;

    cvs: CvEntity[]
}