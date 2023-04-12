import { PartialType } from '@nestjs/swagger';
import { CreateProfileDTO } from './create-profile.dto';

export class UpdateProfileDTO extends PartialType(CreateProfileDTO) {}
