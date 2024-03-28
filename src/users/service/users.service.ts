import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum, User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/crud-users/createUser.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { GetUserDto } from '../dto/crud-users/getUser.dto';
import { adminSeceretConstants } from 'config/envs/secrets/adminSeceret.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(uuid: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOneBy({ uuid });
    return new GetUserDto(user.username, user.nickname);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    if (createUserDto.password === adminSeceretConstants.secret) {
      user.role = RoleEnum.ADMIN;
    }
    user.password = await this.hashPassword(createUserDto.password);
    user.uuid = uuidv4();
    user.username = createUserDto.username;
    user.nickname = createUserDto.nickname;
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
    await this.userRepository.update(id, { deletedAt: new Date() });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
