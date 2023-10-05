import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

interface FindOneParams {
  id?: number;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(attrs: FindOneParams) {
    return this.repo.findOneBy(attrs);
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.entries(attrs).forEach(([key, value]) => (user[key] = value));

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.repo.remove(user);
  }
}
