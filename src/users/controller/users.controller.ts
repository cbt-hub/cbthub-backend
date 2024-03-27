import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/crud-users/create-user.dto';
import { UpdateUserDto } from '../dto/crud-users/update-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  //TODO: User Entity에 Role을 추가 후 관리자만 사용할 수 있게 해야함.
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usersService.getUsers();
  }

  //TODO: 프로필 조회 시 본인만 조회할 수 있게 해야함.
  // path 파라미터를 받는 것이 아니라, JWT 토큰을 통해 본인의 정보만 조회할 수 있게 해야함.
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(+id);
  }

  //TODO: 프로필 수정 시 본인만 수정할 수 있게 해야함.
  // path 파라미터를 받는 것이 아니라, JWT 토큰을 통해 본인의 정보만 수정할 수 있게 해야함.
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  //TODO: 프로필 수정 시 본인만 수정할 수 있게 해야함.
  // path 파라미터를 받는 것이 아니라, JWT 토큰을 통해 본인의 정보만 수정할 수 있게 해야함.
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
