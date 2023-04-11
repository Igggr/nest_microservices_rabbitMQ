import { Repository } from 'typeorm';
import { Test, TestingModule } from "@nestjs/testing"
import { UserService } from "./user.service"
import { getRepositoryToken,  } from "@nestjs/typeorm";
import { User } from "../entities/user-entity";
import { UserRole } from "../entities/user-roie-entity";
import { Role } from "../entities/role-entity";
import { RoleService } from "./role.service";
import { MockRepository, createMockClient, createMockRepository } from '@app/common';

    
describe('UsrService', () => {
    let userService: UserService;
    let userRepository: MockRepository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                RoleService,
                {
                    provide: getRepositoryToken(User),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(UserRole),
                    useValue: createMockRepository(),
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: createMockRepository(),
                }
            ],
            imports: [],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User));
    });

    describe('findById', () => {
        it('Should be defined', () => {
            expect(userService.findById).toBeDefined();
        });

        it('Should find existing user', async () => {
            const id = 1;
            const expected = { id, email: 'johndoe@mail.com', login: 'John', password: 'u73hg38o00829738y*3398=-1$281'}
            userRepository.findOne.mockReturnValue(expected)
            const actual = await userService.findById(id)
            expect(actual).toEqual(expected);
        });

        it('Shoul not find not existing user', async () => {
            const id = 666;
            userRepository.findOne.mockReturnValue(null);
            const actual = await userService.findById(id)
            const expected = null;
            expect(actual).toBe(expected);
        });
    });


})