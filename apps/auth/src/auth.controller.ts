import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { LOGIN } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @EventPattern(LOGIN)
  getHello(data: any) {
    console.log('login ....');
    console.log(data);
  }
}
