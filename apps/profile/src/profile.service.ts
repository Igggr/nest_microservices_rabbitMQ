import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm'
import { Profile } from './entities/profile-entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { AUTH_SERVICE, CREATE_USER, DELETE_USER, LOGIN, LoginDTO, UPDATE_USER, ResponseDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { UpdateProfileDTO } from './dto/update-profile-dto';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(AUTH_SERVICE)
    private readonly client: ClientProxy,
  ) { }

  // отправь сообщение в auth сервис, чтобы он создал пользователя
  // жди ответа, получив userId - используй его при создаиии профиля
  async create(dto: CreateProfileDTO) {
    const payload = { email: dto.email, password: dto.password, login: dto.login };
    const response: ResponseDTO<number> = await firstValueFrom(this.client.send(CREATE_USER, payload));
    if (response.status === 'error') {
      throw new HttpException(response.error, HttpStatus.BAD_REQUEST);
    }
    
    const profile = await this.profileRepository.create({ name: dto.name, surname: dto.surname, phone: dto.phone, userId: response.value });
    return await this.profileRepository.save(profile);
  }

  async login(dto: LoginDTO): Promise<ResponseDTO<string>> {
    const response: ResponseDTO<string> = await firstValueFrom(this.client.send(LOGIN, dto));
    if (response.status === 'error') {
      throw new HttpException(response.error, HttpStatus.FORBIDDEN)
    }
    return response;
  }

  private async findByUserId(userId: number) {
    const user = await this.profileRepository.findOne({
      where: {
        userId: Equal(userId)
      }
    });
    return user;
  }

  async findAll() {
    return this.profileRepository.find();
  }

  async findOne(userid: number) {
    const user = await this.findByUserId(userid);
    if (user) {
      return user;
    }
    throw new HttpException(`Не существует пользователя с id = ${userid}`, HttpStatus.BAD_REQUEST); 
  }

  async update(userId: number, dto: UpdateProfileDTO) {
    if (dto.email || dto.login || dto.password) {  // храниться в таблице user
      // ждать пока user обновится не надо
      this.client.emit(UPDATE_USER, { email: dto.email, login: dto.login, password: dto.password, id: userId });
    }

    const profile = await this.findByUserId(userId);
    if (dto.name || dto.surname || dto.phone) { // хранится в таблице profile   
      profile.name = dto.name ?? profile.name;
      profile.surname = dto.surname ?? profile.surname;
      profile.phone = dto.phone ?? profile.phone;
      return this.profileRepository.save(profile);
    }
    return profile;
  }

  async delete(id: number) {
    const profile = await this.findByUserId(id);
    if (profile) {
      // ждать пока user удалится не надо
      this.client.emit(DELETE_USER, id);
      return await this.profileRepository.remove(profile);
    } else {
      throw new HttpException(`user c id = ${id} не найден`, HttpStatus.NOT_FOUND)
    }
  }

}