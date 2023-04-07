import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CREATE_USER, CreateUserDTO, LOGIN, LoginDTO } from '@app/common';
import { UserService } from './services/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @MessagePattern(CREATE_USER)
  createUser(
    @Payload() dto: CreateUserDTO,
    @Ctx() context: RmqContext,
  ) {
    return this.userService.create(dto);
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
