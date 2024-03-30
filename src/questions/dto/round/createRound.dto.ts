import { ApiProperty, PickType } from '@nestjs/swagger';
import { Round } from '@src/questions/entities/round.entity';
import { IsNumberString } from 'class-validator';

export class CreateRoundDto extends PickType(Round, ['name', 'heldAt']) {
  @ApiProperty({
    description: '회차 이름',
    example: '2021년 1회차',
  })
  name: string;

  @ApiProperty({
    description: '회차 개최일',
    example: '2021-01-01',
  })
  heldAt: Date;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsNumberString()
  categoryId: string;
}
