import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Role } from '../entities/role-entity';
import { CreateRoleDTO } from '../dto/create-role.dto';
import { USER } from '@app/common';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async create(dto: CreateRoleDTO) {
        const role = await this.findRoleByValue(dto.value);
        if (role) {
            throw new RpcException(`Роль c value = ${role.value} уже существует`)
        }
        const newRole = this.roleRepository.create(dto);
        return await this.roleRepository.save(newRole);
    }

    async ensureHas(dto: CreateRoleDTO = USER) {
        let role = await this.findRoleByValue(dto.value);
        if (role) {
            return role;
        }
        role = this.roleRepository.create(dto);
        return await this.roleRepository.save(role);
    }

    async findAll() {
        return await this.roleRepository.find();
    }

    async findRoleByValue(value: string): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                value: Equal(value),
            }
        })
        return role;
    }

    async delete(id: number) {
        const role = await this.roleRepository.findOne({
            where: { id: Equal(id) }
        });
        if (role) {
            return await this.roleRepository.remove(role);
        }
        return 'Роль не найдена';
    }
}
