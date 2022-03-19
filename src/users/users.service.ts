import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUserId(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(userDto);
    return user;
  }
}
