import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

export enum ExplainTypeEnum {
  NORMAL = 'NORMAL',
  GPT3 = 'GPT3',
  GPT4 = 'GPT4',
  GEMINI = 'GEMINI',
  CLOVA = 'CLOVA',
}

@Entity()
export class QuestionExplains {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ExplainTypeEnum.NORMAL })
  @IsEnum([
    ExplainTypeEnum.NORMAL,
    ExplainTypeEnum.GPT3,
    ExplainTypeEnum.GPT4,
    ExplainTypeEnum.GEMINI,
    ExplainTypeEnum.CLOVA,
  ])
  @ApiProperty({
    description: '해설 타입',
    example: ExplainTypeEnum.GPT3,
  })
  type: ExplainTypeEnum;

  @Column({ type: 'varchar', length: 2000 })
  @IsString()
  @ApiProperty({
    description: '정답 해설',
    example: `
      주어진 옵션에서 홈네트워크를 구축하는데 사용되는 기술을 파악해 보겠습니다.
      HomePNA: 홈PNA(Home Phoneline Networking Alliance)는 전화선을 활용하여 네트워크 연결을 제공하는 기술입니다.
      PLC(Power Line Communication): 전력선 통신은 전력 배선을 통해 데이터 통신을 가능하게 하는 기술입니다.
      WiFi/Wireless LAN: 무선 LAN은 무선으로 기기들을 네트워크에 연결시키는 기술입니다.
      따라서 올바른 순서는 다음과 같습니다:
      HomePNA - PLC(Power Line Communication) - WiFi/Wireless LAN
      즉, (A)는 HomePNA, (B)는 PLC(Power Line Communication), (C)는 WiFi/Wireless LAN 입니다.`,
  })
  @IsNotEmpty()
  explain: string;

  @ManyToOne(() => Question, (question) => question.explains)
  question: Question;

  @CreateDateColumn()
  @ApiProperty({
    description: '생성 날짜',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: '업데이트 날짜',
    example: '2023-01-02T00:00:00.000Z',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({
    description: '삭제 날짜 (소프트 삭제)',
    example: '2023-01-03T00:00:00.000Z',
  })
  deletedAt?: Date;
}
