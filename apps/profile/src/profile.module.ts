import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AUTH_SERVICE, DatabaseModule, OPTIONS } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile-entity';
import { ClientsModule } from '@nestjs/microservices';
import { JwtMiddleware } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        APP_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule.forRoot([Profile]),
    TypeOrmModule.forFeature([Profile]),
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        ...OPTIONS,
      },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(ProfileController);
  }
}
