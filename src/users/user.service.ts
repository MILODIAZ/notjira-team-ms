import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { userDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByUserName(userName: string) {
    return await this.userRepo.findOne({ where: { userName } });
  }

  async create(payload: userDto) {
    const newUser = this.userRepo.create(payload);
    return await this.userRepo.save(newUser).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async update(id: number, payload: userDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.userRepo.merge(user, payload);
    return await this.userRepo.save(user).catch((error) => {
      throw new ConflictException(error.detail);
    });
  }

  async delete(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.userRepo.delete({ id });
    return user;
  }
}
