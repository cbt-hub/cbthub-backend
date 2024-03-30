import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class QuestionSolveDto {
  @ApiProperty({
    description: 'user가 정답으로 고른 questionDetails ID',
    example: '1',
  })
  @IsNumberString()
  @IsNotEmpty()
  questionDetailsId: string;
}
