import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  email: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 닉네임', example: 'nickname123' })
  nickname: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 비밀번호', example: 'password' })
  password: string;

  //TODO: User Entity에 Role을 추가. MEMBER, ADMIN 두 가지 역할을 가질 수 있게 해야함.
  //TODO: 멤버쉽 기능을 추가. 무료 회원과 유료 회원으로 나누어야 함.

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
