import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { OPTIONS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<RmqOptions>(
    AuthModule,
    OPTIONS,
  );

  await app.listen();
}
bootstrap();
