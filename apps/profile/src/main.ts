import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  const config = new DocumentBuilder()
    .setTitle('Просто учебный проект')
    .setDescription('Rest API к проекту')
    .setVersion('1.0.0')
    .addTag('v0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'jwt' },
      'defaultBearerAuth',
    )
    .build();

  const documnet = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, documnet);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
