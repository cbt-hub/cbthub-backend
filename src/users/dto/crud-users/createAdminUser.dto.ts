import { PickType } from '@nestjs/mapped-types';
import { RoleEnum, User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminUserDto extends PickType(User, [
  'username',
  'nickname',
  'password',
  'role',
] as const) {
  @ApiProperty({
    description: 'The email of the user',
    example: `user@example.com`,
  })
  username: string;

  @ApiProperty({
    description: 'The nickname of the user',
    example: `nickname123`,
  })
  nickname: string;

  @ApiProperty({
    description: 'The password of the user',
    example: `password`,
  })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: `ADMIN`,
  })
  role: RoleEnum;
}
