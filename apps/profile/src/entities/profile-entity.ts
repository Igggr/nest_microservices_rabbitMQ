import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsPositive,
  IsInt,
  IsString,
  Length,
  IsMobilePhone,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Profile {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiProperty({ description: 'Primary Key', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Type(() => String)
  @Length(3, 30)
  @IsString()
  @ApiProperty({ description: 'Имя пользователя', example: 'John' })
  @Column({ type: String })
  name: string;

  @Type(() => String)
  @Length(3, 30)
  @IsString()
  @ApiProperty({ description: 'Фамилия пользователя', example: 'Doe' })
  @Column({ type: String })
  surname: string;

  @Type(() => String)
  @IsMobilePhone('ru-RU')
  @ApiProperty({ description: 'Телефон пользователя', example: '+79510032345' })
  @Column({ type: String })
  phone: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @ApiProperty({ description: 'Id User, связанного с аккаунтом', example: '1' })
  @Column({ type: Number })
  userId: number;
}
