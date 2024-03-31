import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
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
import { User } from '@src/users/entities/user.entity';
import { Optional } from '@nestjs/common';

export enum QuestionStatusEnum {
  SOLVED_CORRECT = 'SOLVE_CORRECT', // 정답을 맞춘 상태
  SOLVED_WRONG = 'SOLVE_WRONG', // 정답을 틀린 상태
  SOLVED_WRONG_CORRECT = 'SOLVE_WRONG_CORRECT', // 정답을 틀렸다가 맞춘 상태
  SKIPPED = 'SKIPPED', // 건너뛴 상태
}

@Entity()
export class QuestionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestionStatusEnum,
    default: QuestionStatusEnum.SKIPPED,
    enumName: 'question_status_enum',
  })
  @IsEnum([
    QuestionStatusEnum.SOLVED_CORRECT,
    QuestionStatusEnum.SOLVED_WRONG,
    QuestionStatusEnum.SOLVED_WRONG_CORRECT,
    QuestionStatusEnum.SKIPPED,
  ])
  @ApiProperty({
    description: '문제 상태',
    example: 'SOLVE_CORRECT',
  })
  status: QuestionStatusEnum;

  @Column({ nullable: true })
  @IsNumber()
  @ApiProperty({
    description: '사용자가 정답으로 제출한 답의 번호',
    example: 1,
  })
  @Optional()
  questionDetailsId: number;

  @Column({ nullable: false })
  @IsNumber()
  @ApiProperty({
    description: '회차 ID',
    example: 1,
  })
  roundId: number;

  @ManyToOne(() => Question, (question) => question.statuses)
  question: Question;

  @ManyToOne(() => User, (user) => user.statuses)
  user: User;

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
