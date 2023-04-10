import { IntersectionType, OmitType, PickType, PartialType } from "@nestjs/swagger";
import { User } from "../entities/user-entity";

export class UpdateUserDTO extends IntersectionType(
    PickType(User, ['id']),
    PartialType(OmitType(User, ['id'])),
) {}