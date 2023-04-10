import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, CREATE_USER, HasRoleGuard, LOGIN, Roles, SameUserOrHasRoleGuard } from '@app/common';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { LoginDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { Profile } from './entities/profile-entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
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

  @Roles('ADMIN')
  @UseGuards(HasRoleGuard)  // не то, чтоб здесь вобще нужен guard. Но пусть будет 
  async getAll() {

  }

  @Roles('ADMIN')
  @UseGuards(SameUserOrHasRoleGuard)
  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto,
    @Req() req: any
  ) {
    console.log('Updating user');
    console.log(req.user);
  }

  @Roles('ADMIN')
  @UseGuards(SameUserOrHasRoleGuard)
  @Delete('/:id')
  delete(
    @Param('id', ParseIntPipe) id: number
  ) {
    console.log('Deleting user');

  }

}
