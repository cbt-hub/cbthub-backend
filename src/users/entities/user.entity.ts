import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RoleEnum {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  @ApiProperty({
    description: '사용자 고유 UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 닉네임', example: 'nickname123' })
  nickname: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: '사용자 비밀번호', example: 'password' })
  password: string;

  //TODO: 멤버쉽 기능을 추가. 무료 회원과 유료 회원으로 나누어야 함.
  @Column({ default: RoleEnum.MEMBER })
  @IsEnum([RoleEnum.MEMBER, RoleEnum.ADMIN])
  @ApiProperty({
    description: '사용자 역할',
    example: 'MEMBER',
  })
  role: RoleEnum;

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
