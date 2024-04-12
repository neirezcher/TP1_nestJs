import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Créer une instance d'application Express
  const expressApp = express();
  
  // Définir le dossier d'uploads comme ressource statique
  expressApp.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')));

  // Attacher l'application Express à l'application Nest.js
  app.use(expressApp);
  await app.listen(3000);
}
bootstrap();
