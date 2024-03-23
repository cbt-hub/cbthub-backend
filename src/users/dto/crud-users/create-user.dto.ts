import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The nickname of the user' })
  nickname: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
