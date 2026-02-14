import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import configuration from './config/configuration';
import { Logger } from '@nestjs/common';

const logger = new Logger('NestApplication');

async function bootstrap() {
  const { port } = configuration();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      // disableErrorMessages: false
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Campus Click API')
    .setDescription('Documentação da API Campus Click')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.log('Backend is alive on: ', await app.getUrl());
}

void bootstrap();
