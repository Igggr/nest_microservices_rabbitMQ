import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CREATE_USER, CreateUserDTO, LOGIN, LoginDTO, VALIDATE_USER } from '@app/common';
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
    return this.authService.login(data);
  }

  @MessagePattern(VALIDATE_USER)
  validateUser(
    @Payload() auth: { token: string },
    @Ctx() context: RmqContext,
  ) {
    return this.authService.verifyToken(auth.token);
  }
}
