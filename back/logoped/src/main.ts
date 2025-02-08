import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Разрешить CORS
  await app.listen(4200); // или на порту, который вы используете
}
bootstrap();
