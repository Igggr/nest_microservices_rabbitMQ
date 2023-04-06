import { IntersectionType, PickType } from "@nestjs/swagger";
import { Profile } from "../entities/profile-entity";
import { CreateUserDTO } from "@app/common";


export class CreateProfileDTO extends IntersectionType(
    PickType(Profile, ['name', 'surname', 'phone']),
    CreateUserDTO,
){}