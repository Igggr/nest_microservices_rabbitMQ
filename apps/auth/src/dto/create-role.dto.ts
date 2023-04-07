import { PickType } from "@nestjs/swagger";
import { Role } from '../entities/role-entity';


export class CreateRoleDTO extends PickType(Role, ['value', 'description']) { }