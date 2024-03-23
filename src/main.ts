import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CBT Hub API')
    .setDescription('The CBT Hub API description')
    .setVersion('1.0')
    .addTag('auth', '관련된 인증 API들의 집합입니다.')
    .addTag('users', '사용자 정보와 관련된 API들의 집합입니다!')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false,
      validationError: { target: false },
    }),
  );

  await app.listen(3000);
}

bootstrap();
