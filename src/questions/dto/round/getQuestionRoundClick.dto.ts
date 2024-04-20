// src/questions/dto/get-question-round-click.dto.ts
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Question } from '@src/questions/entities/question.entity';
import { QuestionDetails } from '@src/questions/entities/questionDetails.entity';
import {
  ExplainTypeEnum,
  QuestionExplains,
} from '@src/questions/entities/questionExplains.entity';
import { QuestionStatusEnum } from '@src/questions/entities/questionStatus.entity';

export interface QuestionMeta {
  prev: number | null;
  current: number;
  next: number | null;
}

export class QuestionDetailsDto extends PickType(QuestionDetails, [
  'id',
  'choice',
  'isCorrect',
]) {
  @ApiProperty({
    description: '선택지 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '선택지 내용',
    example: 'HomePNA - PLC(Power Line Communication) - Wi-Fi - Wireless LAN',
  })
  choice: string;

  @ApiProperty({
    description: '정답 여부',
    example: false,
  })
  isCorrect: boolean;
}

export class QuestionExplainsDto extends PickType(QuestionExplains, [
  'id',
  'type',
  'explain',
]) {
  @ApiProperty({
    description: '해설 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '해설 타입',
    example: 'GPT3',
  })
  type: ExplainTypeEnum;

  @ApiProperty({
    description: '정답 해설',
    example: `정답은 1번 smb 프로토콜 입니다. 
    나머지 해설은 다음과 같습니다 ... 
    따라서 정답은 1번입니다!`,
  })
  explain: string;
}

export class GetQuestionRoundClickDto extends PickType(Question, [
  'id',
  'title',
  'content',
  'createdAt',
]) {
  @ApiProperty({
    description: '질문 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '질문 제목',
    example: '다음 중 올바른 설명으로 적절한 것은?',
  })
  title: string;

  @ApiProperty({
    description: '질문 내용',
    example: `질문 내용`,
  })
  content: string;

  @ApiProperty({
    description: '생성 날짜',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: QuestionDetailsDto,
    isArray: true,
    description: '질문에 대한 선택지들',
  })
  details: QuestionDetailsDto[];

  @ApiProperty({
    type: QuestionExplainsDto,
    isArray: true,
    description: '질문에 대한 해설들',
  })
  explains: QuestionExplainsDto[];

  @ApiProperty({
    description: '질문 메타 정보',
    example: {
      prev: null,
      current: 1,
      next: 2,
    },
  })
  questionMeta: QuestionMeta;
}

interface QuestionStatusDto {
  id: number;
  status: QuestionStatusEnum;
  isLast: boolean;
  questionDetailsId: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Round 클릭 시, question 전체 조회
 */
export interface GetQuestionRoundClickDtoV2 {
  id: number;
  title: string;
  content?: string;
  image?: string;
  order: number;
  createdAt: Date;
  details: QuestionDetailsDto[];
  explains: QuestionExplainsDto[];
  questionStatus?: QuestionStatusDto;
}

export interface GetQuestionsRoundClickDto {
  questions: GetQuestionRoundClickDtoV2[];
  index: number;
}
