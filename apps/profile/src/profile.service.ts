import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Profile } from './entities/profile-entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { CREATE_USER, LOGIN, LoginDTO } from '@app/common';
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
    console.log(userId)
    const profile = await this.profileRepository.create({ name: dto.name, surname: dto.surname, phone: dto.phone, userId });
    console.log(profile);
    return await this.profileRepository.save(profile);
  }

  async logn(dto: LoginDTO) {
    const token = await firstValueFrom(this.client.send(LOGIN, dto));
    return { token };
  }

}
