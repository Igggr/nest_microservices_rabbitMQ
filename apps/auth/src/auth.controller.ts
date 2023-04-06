import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CREATE_USER, CreateUserDTO, LOGIN, LoginDTO } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @MessagePattern(CREATE_USER)
  createUser(
    @Payload() dto: CreateUserDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log('creating ')
    console.log(dto);

    return "I'm id"
  }

  @MessagePattern(LOGIN)
  login(
    @Payload() data: LoginDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log('login ....');
    console.log(data);

    return { token: 'jhgujjhgybgfys'}
  }
}
