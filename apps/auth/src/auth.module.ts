import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/common';
import { User } from './entities/user-entity';
import { Role } from './entities/role-entity';
import { UserRole } from './entities/user-roie-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
      })
    }),
    DatabaseModule.forRoot([User, UserRole, Role]),
    TypeOrmModule.forFeature([User, UserRole, Role])

  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
