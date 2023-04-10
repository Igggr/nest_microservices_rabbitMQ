import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { User } from '../entities/user-entity';
import { CreateUserDTO, USER } from '@app/common';
import { RoleService } from './role.service';
import { UserRole } from '../entities/user-roie-entity';
import { Role } from '../entities/role-entity';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        private readonly roleService: RoleService,
    ) { }

    async hasUserWithEmail(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: Equal(email) } });
        return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: Equal(id) } });
        return user;
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async create(dto: CreateUserDTO): Promise<number> {
        if (await this.hasUserWithEmail(dto.email)) {
            throw new RpcException(`Пользователь с email ${dto.email} уже существует`)
        }
        const user = this.userRepository.create({ login: dto.login, email: dto.email });
        await user.setPassword(dto.password);

        await this.userRepository.save(user);

        const role = await this.roleService.ensureHas(USER);
        await this.assignRoleToUser(user, role);
        
        return user.id;
    }

    async delete(id: number) {
        console.log(`Deleting user ${id}`);
        const res = await this.userRepository.delete(id);
        return res;
    }

    async getRoles(user: User): Promise<string[]> {
        const userRoles = (await this.userRepository.findOne(
            {
                where: { id: Equal(user.id) },
                relations: { userRoles: true } // нужен еще один запрос в БДб чтобы добраться до ролей
            })
        ).userRoles;
        const roles = userRoles?.map((ur) => ur.role.value) ?? [];
        return roles;
    }

    private async assignRoleToUser(user: User, role: Role, grantedBy?: User) {
        const userRole = await this.userRoleRepository.findOne({
            where: {
                userId: Equal(user.id),
                roleId: Equal(role.id),
            }
        });
        if (userRole) {
            return;
        }
        const newUserRole = this.userRoleRepository.create({ user, role });

        if (grantedBy) {
            newUserRole.grantedBy = grantedBy;
        }

        await this.userRoleRepository.save(newUserRole);
        return;
    }

}
