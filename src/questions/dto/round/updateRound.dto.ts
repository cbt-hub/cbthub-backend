import { ApiProperty, PickType } from '@nestjs/swagger';
import { Round } from '@src/questions/entities/round.entity';
import { IsOptional, Matches } from 'class-validator';

export class UpdateRoundDto extends PickType(Round, ['name']) {
  @ApiProperty({
    description: 'round name',
    example: '(변경) 2024년 3회차',
  })
  name: string;

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
}
