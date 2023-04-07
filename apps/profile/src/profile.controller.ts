import { Body, Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { CREATE_USER, LOGIN } from '@app/common';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { LoginDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { Profile } from './entities/profile-entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) { }

  @ApiOperation({ summary: 'Создает новый Profile (и новый User)' })
  @ApiResponse({status: HttpStatus.CREATED, type: Profile})
  @Post('/register')
  async register(@Body() dto: CreateProfileDTO): Promise<Profile> {
    return this.profileService.create(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDTO) {
    return this.profileService.logn(dto);
  }
}
