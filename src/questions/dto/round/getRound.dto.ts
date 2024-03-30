import { ApiProperty, PickType } from '@nestjs/swagger';
import { Round } from '@src/questions/entities/round.entity';

export class GetRoundDto extends PickType(Round, [
  'name',
  'heldAt',
  'createdAt',
]) {
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
    description: '진행률',
    example: 66.7,
  })
  progressRate: number;

  @ApiProperty({
    description: '생성 날짜',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
