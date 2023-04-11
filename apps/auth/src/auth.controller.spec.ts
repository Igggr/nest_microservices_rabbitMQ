import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RoleService } from './services/role.service';
import { JWT_SECRET } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from './entities/user-roie-entity';
import { User } from './entities/user-entity';
import { Role } from './entities/role-entity';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UserService,
        RoleService,
        ConfigService,
        {
          provide: getRepositoryToken(UserRole),
          useValue: {}
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne() {
              return {
                checkPassword() {
                  return true;
                }
              }
            }
          }
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {}
        },
        {
          provide: 'ConfigService',
          useValue: {
            get(key) {
              switch (key) {
                case JWT_SECRET: return 'jwt secret';
              }
            }
          }
        }
      ],
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              JWT_SECRET: 'o'
            })]
        }),  // кажется нужно из-за injection в useFacorys

        // JwtModule.registerAsync({
        //   useFactory: ((configService: ConfigService) => ({
        //     secret: configService.get(JWT_SECRET),
        //     signOptions: {
        //       expiresIn: '24h'
        //     }
        //   })
        //   ),
        //   inject: [ConfigService]
        // }),
      ]
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('defined', () => {
      expect(authController.login).toBeDefined()
    })


    // it('iii', async () => {
    //   const r = await authController.login({ email: 'valid@mail.ru', password: 'validpass' });
    //   expect(r).toBe({})
    // })
  })

  describe('createUser', () => {
    it('defined', () => {
      expect(authController.createUser).toBeDefined()
    })
  })

});
