import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/crud-users/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(
    id: number,
    updatedUser: Partial<User>,
  ): Promise<User | undefined> {
    await this.userRepository.update(id, updatedUser);
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
