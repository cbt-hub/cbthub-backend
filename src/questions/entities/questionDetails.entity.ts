import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
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

@Entity()
export class QuestionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @ApiProperty({
    description: '선택지',
    example: 'HomePNA - PLC(Power Line Communication) - Wi-Fi - Wireless LAN',
  })
  @IsNotEmpty()
  choice: string;

  @Column({ default: false })
  @ApiProperty({
    description: '정답 여부',
    example: false,
  })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.details)
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
