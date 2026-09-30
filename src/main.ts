import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOADS_DIR } from './book/book.service.js';

async function bootstrap() {
  const PORT: number = 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });
  await app.listen(process.env.PORT ?? PORT, () => {
    console.log(`Server has been http://localhost:${PORT}`);
  });
}
await bootstrap();
