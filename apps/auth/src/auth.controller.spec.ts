import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from './services/role.service';

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
        {
          provide: 'UserRoleRepository',
          useValue: {}
        },
        {
          provide: 'UserRepository',
          useValue: {}
        },
        {
          provide: 'RoleRepository',
          useValue: {}
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('defined', () => {
      expect(authController.login).toBeDefined()
    })
  })

  describe('createUser', () => {
    it('defined', () => {
      expect(authController.createUser).toBeDefined()
    })
  })

});
