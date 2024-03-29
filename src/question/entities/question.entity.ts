import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionDetails } from './questionDetails.entity copy';

@Entity()
export class Question {
  //TODO: Question Entity 작성
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    description: '질문 제목',
    example: '다음 중 올바른 설명으로 적절한 것은?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '질문 내용',
    example: `- 일반적으로 3.1~10.6GHz 대역에서, 
    기존의 스펙트럼에 비해 매우 넓은 대역에 결쳐 낮은 전력으로 \
    초고속 통신을 실현하는 근거리 무선 통신 기술이다.
    - 약 2나노초 길이의 펄스를 이용해 센티미터 단위의 정확도로 \
    거리를 측정할 수 있다.
    - 최근 사물인터넷의 발달로 위치와 거리를 정밀하게 측정 \
    하려는 수요가 늘어나면서 재부상했다.`,
  })
  @IsString()
  @IsOptional()
  content: string | null;

  @Column({ nullable: true })
  @ApiProperty({
    description: '사진',
    example:
      'https://hellocbt.com/files/attach/images/2024/01/07/d3d842b45c93e061f889e40bbbc28da4.png',
  })
  @IsString()
  @IsOptional()
  image: string | null;

  @OneToMany(() => QuestionDetails, (details) => details.question)
  details: QuestionDetails[];

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
