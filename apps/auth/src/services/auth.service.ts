import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from '../entities/user-entity';
import { JwtService } from '@nestjs/jwt';
import { AUTH_ERROR, INCORRECT_EMAIL_OR_PASSWORD, JWT_SECRET, LoginDTO } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ResponseDTO } from '@app/common/dto/response-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  async login(dto: LoginDTO): Promise<ResponseDTO<string>> {
    try {
      const user = await this.validateUser(dto);
      const token = await this.generateToken(user);
      return {
        status: 'ok',
        value: token
      };
    } catch (e) {
      return {
        status: 'error',
        error: e.message
      }
    }
   
  }

  private async generateToken(user: User) {
    const roles = await this.userService.getRoles(user);
    const payload = { email: user.email, id: user.id, roles };
    
    const token = this.jwt.sign(payload);
    return token;
  }

  private async validateUser(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && await user.checkPassword(dto.password)) {
      return user;
    }
    throw new UnauthorizedException({ message: INCORRECT_EMAIL_OR_PASSWORD });
  }

  verifyToken(token: string) {
    const secret = this.configService.get(JWT_SECRET);
    console.log(secret);
    const user1 = this.jwt.verify(token);
    const user = this.jwt.verify(token, { secret });
    return user;
  }
  
}
