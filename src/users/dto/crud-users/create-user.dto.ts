import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, [
  'username',
  'nickname',
  'password',
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
}
