import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { CREATE_USER, LOGIN } from '@app/common';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { LoginDTO } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) { }

  @Post('/register')
  async register(@Body() dto: CreateProfileDTO) {
    const payload = { email: dto.email, password: dto.password, login: dto.login };
    const userId = await firstValueFrom(this.client.send(CREATE_USER, payload));
    console.log(`user id is : ${userId}`)
    return 'sent'
  }

  @Post('/login')
  async login(@Body() dto: LoginDTO) {
    const resp = await firstValueFrom(this.client.send(LOGIN, dto));
    console.log(resp);
    return 'sent'
  }
}
