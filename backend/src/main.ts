import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Разрешить только известные свойства
      transform: true, // Преобразовать типы данных
      forbidNonWhitelisted: true, // Запретить неизвестные свойства
      validationError: { target: false }, // Отключить объект ошибки
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
