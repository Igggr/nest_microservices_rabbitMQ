import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user-entity';
import { JwtService } from '@nestjs/jwt';
import { INCORRECT_EMAIL_OR_PASSWORD, JWT_SECRET, LoginDTO } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { AuthDTO, ResponseDTO } from '@app/common/dto/response-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDTO): Promise<ResponseDTO<string>> {
    try {
      const user = await this.validateUser(dto);
      const token = await this.generateToken(user);
      return {
        status: 'ok',
        value: token,
      };
    } catch (e) {
      return {
        status: 'error',
        error: e.message,
      };
    }
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    const token = this.jwt.sign(payload);
    return token;
  }

  private async validateUser(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await user.checkPassword(dto.password))) {
      return user;
    }
    throw new UnauthorizedException({ message: INCORRECT_EMAIL_OR_PASSWORD });
  }

  async verifyToken(token: string): Promise<ResponseDTO<AuthDTO>> {
    try {
      const secret = this.configService.get(JWT_SECRET);
      const { id } = this.jwt.verify(token, { secret });
      const user = await this.userService.findById(id);
      if (!user) {
        return {
          status: 'error',
          error: 'Пользователь, которому принадлежал этот токен был удален',
        };
      }
      const roles = await this.userService.getRoles(id);

      return {
        status: 'ok',
        value: {
          id,
          email: user.email,
          login: user.login,
          roles,
        },
      };
    } catch (e) {
      return {
        status: 'error',
        error: e.message,
      };
    }
  }
}
