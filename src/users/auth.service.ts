import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  private async authorize(userId: string) {
    const accessToken = jwt.sign({ userId }, 'secret', { expiresIn: '10s' });
    const refreshToken = jwt.sign({ accessToken }, 'secret', {
      expiresIn: '5m',
    });

    await this.usersService.update(Number(userId), {
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async signup(attrs: Partial<User>) {
    const { email, password } = attrs;

    const user = await this.usersService.findOne({ email });

    if (user) {
      throw new BadRequestException('User with such email already exists.');
    }

    const createdUser = await this.usersService.create(email, password);

    return this.authorize(createdUser.id.toString());
  }

  async signin(attrs: Partial<User>) {
    const { email, password } = attrs;

    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User with such email does not exist.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Wrong password.');
    }

    return this.authorize(user.id.toString());
  }

  async checkSession(token: string) {
    jwt.verify(token, 'secret');

    const user = await this.usersService.findOne({ accessToken: token });

    return user;
  }

  async refreshSession(token: string) {
    jwt.verify(token, 'secret');

    const user = await this.usersService.findOne({ refreshToken: token });

    return this.authorize(user.id.toString());
  }
}
