import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  Roles,
  HasRoleGuard,
  SameUserOrHasRoleGuard,
  ADMIN,
  ResponseDTO,
  TokenResponse,
  SWAGGER_FORBIDDEN_RESPONSE,
  INCORRECT_EMAIL_OR_PASSWORD,
  SWAGGER_USER_ID_PARAM,
} from '@app/common';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { LoginDTO } from '@app/common';
import { Profile } from './entities/profile-entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileDTO } from './dto/update-profile-dto';
import { BearerAuth } from '@app/common/auth/auth';

@ApiTags('Профили пользователей')
@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Создает новый Profile (и новый User)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Profile })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Пользователь с email John@mail.com уже существует',
      },
    },
  })
  @Post('/register')
  async register(@Body() dto: CreateProfileDTO): Promise<Profile> {
    return this.profileService.create(dto);
  }

  @ApiOperation({ summary: 'Получение jwt-токена' })
  @ApiResponse({ status: 200, type: TokenResponse })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    schema: {
      example: {
        statusCode: '403',
        message: INCORRECT_EMAIL_OR_PASSWORD,
      },
    },
  })
  @Post('/login')
  async login(@Body() dto: LoginDTO): Promise<ResponseDTO<string>> {
    return this.profileService.login(dto);
  }

  @Roles(ADMIN.value)
  @UseGuards(HasRoleGuard) // не то, чтоб здесь вобще нужен guard. Но пусть будет. Чисто чтобы испытать и этот guard тоже
  @ApiBearerAuth(BearerAuth)
  @ApiOperation({ summary: 'Получает инфорацию обо всех профилях' })
  @ApiResponse(SWAGGER_FORBIDDEN_RESPONSE)
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('')
  async getAll() {
    return this.profileService.findAll();
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Получает инфорацию о конкретном профиле' })
  @ApiParam(SWAGGER_USER_ID_PARAM)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        statusCode: 400,
        message: 'Не существует пользователя с id = 1',
      },
    },
  })
  @ApiResponse({ status: 200, type: Profile })
  getOne(@Param('userId') userId: number) {
    return this.profileService.findOne(userId);
  }

  @Roles(ADMIN.value)
  @UseGuards(SameUserOrHasRoleGuard)
  @ApiBearerAuth(BearerAuth)
  @ApiOperation({
    summary: 'Обновление информации о пользователе и его профиле',
  })
  @ApiParam(SWAGGER_USER_ID_PARAM)
  @ApiResponse(SWAGGER_FORBIDDEN_RESPONSE)
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: Profile })
  @Patch('/:userId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateProfileDTO,
  ) {
    return this.profileService.update(userId, dto);
  }

  @HttpCode(HttpStatus.GONE)
  @Roles(ADMIN.value)
  @UseGuards(SameUserOrHasRoleGuard)
  @ApiBearerAuth(BearerAuth)
  @ApiOperation({ summary: 'Удаление пользовтеля и его профиля' })
  @ApiParam(SWAGGER_USER_ID_PARAM)
  @ApiResponse(SWAGGER_FORBIDDEN_RESPONSE)
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: Profile })
  @Delete('/:userId')
  delete(
    // Может должно быть profile.id, а не user.id? Удаляются в принципе оба
    // Сделал на user.id. потому что все guard работают с объектом, возвращаемым auth модулем
    // а он возвращает user (c user.id)
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.profileService.delete(userId);
  }
}
