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
import { CreateUserDto } from '../dto/crud-users/createUser.dto';
import { UpdateUserDto } from '../dto/crud-users/updateUser.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { Auth } from 'libs/decorator/auth.decorator';
import { GetUser } from 'libs/decorator/getUser.decorator';
import { GetUserDto } from '../dto/crud-users/getUser.dto';

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description 사용자 생성
   * - 사용자 생성 시 비밀번호는 암호화하여 저장
   * - uuid는 사용자 식별자로 사용
   * * NOTE: adminSeceretConstants와 비밀번호가 동일하면 ADMIN으로 등록됨
   * * FIXME: 추후 seed에 ADMIN 계정이 추가되게끔 하고, ADMIN 계정이 ADMIN 권한을 부여하도록 수정
   */
  @Post()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.debug('Creating a user');
    return await this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  @Auth()
  async getProfile(@GetUser() user: any): Promise<GetUserDto> {
    this.logger.debug('Getting user profile');
    return await this.usersService.getProfile(user.uuid);
  }

  //TODO: 프로필 수정 기능 추가
  //TODO: 비밀번호 변경 기능 추가
  //TODO: 회원 탈퇴 기능 추가 (soft delete)

  @Get()
  @Admin()
  async findAll() {
    this.logger.debug('Getting all users');
    return await this.usersService.getUsers();
  }

  @Get(':id')
  @Admin()
  async findOne(@Param('id') id: string) {
    this.logger.debug(`Finding user with id ${id}`);
    return await this.usersService.getUserById(+id);
  }

  @Patch(':id')
  @Admin()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.debug(`Updating user with id ${id}`);
    return await this.usersService.updateUser(+id, updateUserDto);
  }

  /**
   * @description soft delete, deletedAt에 삭제 시간을 기록
   * - soft delete된 사용자는 로그인 불가능
   */
  @Delete(':id')
  @Admin()
  async remove(@Param('id') id: string) {
    this.logger.debug(`Deleting user with id ${id}`);
    return await this.usersService.deleteUser(+id);
  }
}
