import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    origin: process.env.DOMAIN,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
