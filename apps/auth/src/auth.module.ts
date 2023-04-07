import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { DatabaseModule, JWT_SECRET, OPTIONS } from '@app/common';
import { User } from './entities/user-entity';
import { Role } from './entities/role-entity';
import { UserRole } from './entities/user-roie-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './services/user.service';
import { RolesService } from './services/role.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
        JWT_SECRET: Joi.string().required()
      })
    }),
    DatabaseModule.forRoot([User, UserRole, Role]),
    TypeOrmModule.forFeature([User, UserRole, Role]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        ...OPTIONS,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: ((configService: ConfigService) => ({
          secret: configService.get(JWT_SECRET),
            signOptions: {
            expiresIn: '24h'
          }
        })
      ),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    RolesService,
  ],
})
export class AuthModule {}
