import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { of } from 'rxjs';
import {
  AUTH_SERVICE,
  INCORRECT_EMAIL_OR_PASSWORD,
  LoginDTO,
  MockClient,
  MockRepository,
  createMockClient,
  createMockRepository,
} from '@app/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './entities/profile-entity';
import { HttpException } from '@nestjs/common';

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileRepository: MockRepository<Profile>;
  let client: MockClient;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: createMockRepository(),
        },
        {
          provide: AUTH_SERVICE,
          useValue: createMockClient(),
        },
      ],
    }).compile();

    profileController = app.get<ProfileController>(ProfileController);
    profileRepository = app.get(getRepositoryToken(Profile));
    client = app.get(AUTH_SERVICE);
  });

  describe('login', () => {
    it('defined', () => {
      expect(profileController.login).toBeDefined();
    });

    // а в контроллере ли я это должен тестировать? Может в сервисе?
    it('Give jwt token for correct email and password', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvaG5AbWFpbC5jb20iLCJpZCI6MTQsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjgwODgyOTIxLCJleHAiOjE2ODA5NjkzMjF9.sFEZYuzECYPi3AZawy0pFeCytilKFdZLdlFFnfj5cFA';
      const loginDTO: LoginDTO = {
        email: 'better@mail.ru',
        password: 'correct password',
      };

      client.send.mockReturnValue(of({ status: 'ok', value: token }));

      const res = await profileController.login(loginDTO);
      expect(res).toEqual({ status: 'ok', value: token });
    });

    it('Show error for incorrect email or password', async () => {
      const loginDTO: LoginDTO = {
        email: 'better@mail.ru',
        password: 'incorrect pasword',
      };

      client.send.mockReturnValue(
        of({ status: 'error', error: INCORRECT_EMAIL_OR_PASSWORD }),
      );

      expect(profileController.login(loginDTO)).rejects.toThrow(HttpException);
    });
  });

  describe('registration', () => {
    it('defined', () => {
      expect(profileController.register).toBeDefined();
    });

    it('Will call client.send and save returned id as userId field of profile', async () => {
      const profile = {
        name: 'saul',
        surname: 'Goodman ',
        phone: '505-842-5662',
      };
      const user = {
        login: 'better call',
        email: 'better@mail.ru',
        password: 'qwerty',
      };
      const expected = { ...profile, id: 1, userId: 2 };

      profileRepository.save.mockReturnValue(expected);
      client.send.mockReturnValue(of({ status: 'ok', value: 2 }));

      const res = await profileController.register({ ...user, ...profile });
      expect(res).toEqual(expected);
    });
  });
});
