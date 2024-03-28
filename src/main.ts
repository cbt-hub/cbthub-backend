import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpErrorFilter } from 'libs/lifecycle/filter/httpError.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder() // Swagger 설정
    .setTitle('CBT Hub API')
    .setDescription('The CBT Hub API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'oauth2',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        flows: {
          password: {
            tokenUrl: '/api/v1/auth/signin',
            scopes: {},
          },
        },
      },
      'OAuth2PasswordBearer',
    )
    .addTag('auth', '관련된 인증 API들의 집합입니다.')
    .addTag('users', '사용자 정보와 관련된 API들의 집합입니다!')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    // class-validator와 class-transformer를 사용하여 유효성 검사를 수행
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false,
      validationError: { target: false },
    }),
  );

  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(3000);
}

bootstrap();
