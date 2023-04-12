import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from './services/role.service';
import { ConfigService } from '@nestjs/config';
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
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne() {
              return {
                checkPassword() {
                  return true;
                },
              };
            },
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {},
        },
      ],
      imports: [],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('defined', () => {
      expect(authController.login).toBeDefined();
    });
  });
});
