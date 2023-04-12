import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @Type(() => String)
  @IsString()
  @Length(3, 20)
  @ApiProperty({ description: 'login', example: 'John43' })
  login: string;

  @Type(() => String)
  @IsEmail()
  @ApiProperty({ description: 'email', example: 'johndoe@mail.com' })
  email: string;

  @Type(() => String)
  @IsString()
  @Length(6, 60)
  @ApiProperty({
    description: 'пароль',
    example: '123qwerty',
    writeOnly: true, // содержится в запросах, но не в ответах
  })
  password: string;
}
