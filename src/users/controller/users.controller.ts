import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/crud-users/create-user.dto';
import { UpdateUserDto } from '../dto/crud-users/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { Auth } from 'libs/decorator/auth.decorator';

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating a user');
    return await this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  @Auth()
  async getProfile() {
    this.logger.log('Getting user profile');
    return await this.usersService.getProfile();
  }

  @Get()
  @Admin()
  async findAll() {
    this.logger.log('Getting all users');
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @Admin()
  async findOne(@Param('id') id: string) {
    this.logger.log(`Finding user with id ${id}`);
    return await this.usersService.getUserById(+id);
  }

  @Patch(':id')
  @Admin()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id ${id}`);
    return await this.usersService.updateUser(+id, updateUserDto);
  }

  /**
   * @description soft delete, deletedAt에 삭제 시간을 기록
   * - soft delete된 사용자는 로그인 불가능
   */
  @Delete(':id')
  @Admin()
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting user with id ${id}`);
    return await this.usersService.deleteUser(+id);
  }
}
