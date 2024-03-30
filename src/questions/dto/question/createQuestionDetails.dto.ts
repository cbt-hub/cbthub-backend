import { ApiProperty, PickType } from '@nestjs/swagger';
import { QuestionDetails } from '../../entities/questionDetails.entity';

export class CreateQuestionDetailsDto extends PickType(QuestionDetails, [
  'choice',
  'isCorrect',
]) {
  @ApiProperty({
    description: '선택지',
    example: 'HomePNA - PLC(Power Line Communication) - Wi-Fi - Wireless LAN',
  })
  choice: string;

  @ApiProperty({
    description: '정답 여부',
    example: false,
  })
  isCorrect: boolean;
}
