import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Category } from './category.entity';

@Entity()
export class Round {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '회차 이름',
    example: '2021년 1회차',
  })
  name: string;

  @Column({ nullable: false })
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: '회차 개최일',
    example: '2021-01-01',
  })
  heldAt: Date;

  @OneToMany(() => Question, (question) => question.round, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    description: '회차에 포함된 문제들',
    example: '1회차에 포함된 문제들',
  })
  questions: Question[];

  @ManyToOne(() => Category, (category) => category.Rounds)
  @ApiProperty({
    description: '회차가 속한 카테고리',
    example: '1회차가 속한 카테고리',
  })
  category: Category;

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
