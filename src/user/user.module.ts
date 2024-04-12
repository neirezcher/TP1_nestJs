import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CvEntity } from '../cv/entities/cv.entity';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CvEntity, UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
