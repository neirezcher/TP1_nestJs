import { Module, NestModule, MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { ConfigModule } from '@nestjs/config';
import { SkillEntity } from './skill/entities/skill.entity';
import { UserEntity } from './auth/entities/user.entity';
import { CvEntity } from './cv/entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from './middleware/upload.middleware';


@Module({
  imports: [CvModule, UserModule, SkillModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [UserEntity, SkillEntity, CvEntity],
    synchronize: true,
  }),
  AuthModule,
  MulterModule.register({
    limits: {
      fileSize: 1024 * 1024, // Limite de 1 Mo
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only jpg, jpeg, and png files are allowed.'), false);
      }
      cb(null, true);
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("todo", "cv");
    consumer
      .apply(UploadMiddleware)
      .forRoutes({ path: 'cv/upload', method: RequestMethod.POST });
  }
}


