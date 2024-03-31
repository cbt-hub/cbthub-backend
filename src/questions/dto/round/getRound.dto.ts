import { ApiProperty, PickType } from '@nestjs/swagger';
import { Round } from '@src/questions/entities/round.entity';
import { IsOptional } from 'class-validator';

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
    description: '진행률 - (전체 - SKIP)/전체',
    example: 66.7,
  })
  @IsOptional()
  progressRate: number;

  @ApiProperty({
    description: 'SKIPPED 문제 수',
    example: 5,
  })
  @IsOptional()
  skippedCount: number;

  @ApiProperty({
    description: 'SOLVED_WRONG 문제 수',
    example: 10,
  })
  @IsOptional()
  solvedWrongCount: number;

  @ApiProperty({
    description: 'SOLVED_CORRECT 문제 수',
    example: 15,
  })
  @IsOptional()
  solvedCorrectCount: number;

  @ApiProperty({
    description: 'SOLVED_WRONG_CORRECT 문제 수',
    example: 10,
  })
  @IsOptional()
  solvedWrongCorrectCount: number;

  @ApiProperty({
    description: '생성 날짜',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
