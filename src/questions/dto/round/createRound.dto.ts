import { ApiProperty, PickType } from '@nestjs/swagger';
import { Round } from '@src/questions/entities/round.entity';
import { IsNumberString, IsOptional, Matches } from 'class-validator';

export class CreateRoundDto extends PickType(Round, ['name']) {
  @ApiProperty({
    description: '회차 이름',
    example: '2021년 1회차',
  })
  name: string;

  // 정규식으로 다음 날짜 형식인지 확인합니다.
  // yyyy-MM-dd
  @ApiProperty({
    description: '회차 개최일',
    example: '2021-01-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'heldAt은 "yyyy-MM-dd" 형식이어야 합니다.',
  })
  heldAt: string;

  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsNumberString()
  categoryId: string;
}
