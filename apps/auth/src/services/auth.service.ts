import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from '../entities/user-entity';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET, LoginDTO } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  async login(dto: LoginDTO) {
    const user = await this.validateUser(dto);
    const token = await this.generateToken(user);
    return token;
  }

  private async generateToken(user: User) {
    const roles = await this.userService.getRoles(user);
    const payload = { email: user.email, id: user.id, roles };
    
    const token = this.jwt.sign(payload);
    return token;
  }

  private async validateUser(dto: LoginDTO) {
    try {
      const user = await this.userService.findByEmail(dto.email);
      if (user && await user.checkPassword(dto.password)) {
        return user;
      }
      throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    } catch (e) {
      throw new UnauthorizedException({ message: 'Авторизация не удалась' });
    }
  }

  verifyToken(token: string) {
    const secret = this.configService.get(JWT_SECRET);
    console.log(secret);
    const user1 = this.jwt.verify(token);
    const user = this.jwt.verify(token, { secret });
    return user;
  }
  
}
