import { PickType } from '@nestjs/mapped-types';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto extends PickType(User, ['email', 'password'] as const) {
  @ApiProperty({
    description: 'The email of the user',
    example: `user@example.com`,
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: `password`,
  })
  password: string;
}
