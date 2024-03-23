import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { generateRandomString } from 'libs/utils/gen.random.string';

export class CreateUserDto extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {
  @ApiProperty({
    description: 'The email of the user',
    example: `user${generateRandomString()}@example.com`,
  })
  email: string;

  @ApiProperty({
    description: 'The nickname of the user',
    example: `nickname${generateRandomString()}`,
  })
  nickname: string;

  @ApiProperty({
    description: 'The password of the user',
    example: `password${generateRandomString()}`,
  })
  password: string;
}
