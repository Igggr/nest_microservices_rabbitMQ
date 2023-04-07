import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { of } from 'rxjs';
import { CREATE_USER, LOGIN } from '@app/common';


describe('ProfileController', () => {
  let profileController: ProfileController;
  const profile = { name: 'saul', surname: 'Goodman ', phone: '505-842-5662' };
  const user = { login: 'better call', email: 'better@mail.ru', password: 'qwerty' };
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvaG5AbWFpbC5jb20iLCJpZCI6MTQsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjgwODgyOTIxLCJleHAiOjE2ODA5NjkzMjF9.sFEZYuzECYPi3AZawy0pFeCytilKFdZLdlFFnfj5cFA';
  const userId = 1;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: 'ProfileRepository',
          useValue: {
            create: (dto) => dto ,
            save: (dto) => dto,
          }
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            send(event) {
              switch (event) {
                case LOGIN:
                  return of(token);
                case CREATE_USER:
                  return of(userId);
              }
            }
          }
        }
      ],
    }).compile();

    profileController = app.get<ProfileController>(ProfileController);
  });

  describe('login', () => {
    it('defined', () => {
      expect(profileController.login).toBeDefined();
    });

    it('Pass value to client.send and return first observed value', async () => {
      const res = await profileController.login({ email: user.email, password: user.password});
      expect(res).toEqual({ token});
    });
  });

  describe('registration', () => {
    it('defined', () => {
      expect(profileController.register).toBeDefined();
    });

    it('Will call client.send and save returned id as userId field of profile', async () => {
      const res = await profileController.register({ ...user, ...profile });
      expect(res).toEqual({...profile, userId });
    })
  });

});
