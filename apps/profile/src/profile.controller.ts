import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { LOGIN } from '@app/common';

@Controller()
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) { }

  @Post('login')
  login() {
    console.log('emiting')
    this.client.emit(LOGIN, { email: 'admin@mail.com', password: '111111' });
    return 'sent'
  }
}
