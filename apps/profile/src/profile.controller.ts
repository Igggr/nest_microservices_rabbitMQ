import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, Roles, HasRoleGuard, SameUserOrHasRoleGuard } from '@app/common';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { LoginDTO } from '@app/common';
import { Profile } from './entities/profile-entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProfileDTO } from './dto/update-profile-dto';


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
  @UseGuards(HasRoleGuard)  // не то, чтоб здесь вобще нужен guard. Но пусть будет. Чисто чтобы испытать и этот guard тоже 
  @Get('')
  async getAll() {
    return this.profileService.findAll();
  }

  @Roles('ADMIN')
  @UseGuards(SameUserOrHasRoleGuard)
  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto : UpdateProfileDTO,
    @Req() req: any
  ) {
    return this.profileService.update(userId, dto);
  }

  @Roles('ADMIN')
  @UseGuards(SameUserOrHasRoleGuard)
  @Delete('/:id')
  delete(
     // Может должно быть profile.id, а не user.id? Удаляются в принципе оба
     // Сделал на user.id. потому что все guard работают с объектом, возвращаемым auth модулем
    // а он возвращает user (c user.id)
    @Param('id', ParseIntPipe) userId: number  
  ) {
    return this.profileService.delete(userId);
  }

}
