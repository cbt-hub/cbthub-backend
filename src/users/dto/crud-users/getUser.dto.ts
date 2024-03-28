import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto extends PickType(User, [
  'username',
  'nickname',
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

  constructor(username: string, nickname: string) {
    super();
    this.username = username;
    this.nickname = nickname;
  }
}
