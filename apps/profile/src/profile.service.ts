import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm'
import { Profile } from './entities/profile-entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { CREATE_USER, DELETE_USER, LOGIN, LoginDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
  ) { }

  // отправь сообщение в auth сервис, чтобы он создал пользователя
  // жди ответа, получив userId - используй его при создаиии профиля
  async create(dto: CreateProfileDTO) {
    const payload = { email: dto.email, password: dto.password, login: dto.login };
    const userId = await firstValueFrom(this.client.send(CREATE_USER, payload));
    const profile = await this.profileRepository.create({ name: dto.name, surname: dto.surname, phone: dto.phone, userId });
    return await this.profileRepository.save(profile);
  }

  async logn(dto: LoginDTO) {
    const token = await firstValueFrom(this.client.send(LOGIN, dto));
    return { token };
  }

  async findByUserId(userId: number) {
    const user = await this.profileRepository.findOne({
      where: {
        userId: Equal(userId)
      }
    });
    return user;
  }

  async delete(id: number) {
    const profile = await this.findByUserId(id);
    if (profile) {
      console.log()
      this.client.emit(DELETE_USER, id);
      return await this.profileRepository.remove(profile);
    } else {
      throw new HttpException(`user c id = ${id} не найден`, HttpStatus.NOT_FOUND)
    }
  }

}