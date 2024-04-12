// upload.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    diskStorage({
      destination: '../../public/uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    });
    next();
  }
}
