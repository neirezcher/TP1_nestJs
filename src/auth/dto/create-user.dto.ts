// create-user.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { CvEntity } from "../../cv/entities/cv.entity";
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  cvs: CvEntity[]
}