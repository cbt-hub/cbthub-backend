import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from '../entities/round.entity';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { Category } from '../entities/category.entity';
import { convertYyyymmddToDate } from 'libs/utils/date.util';
import { UpdateRoundDto } from '../dto/round/updateRound.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';
import { decode } from 'jsonwebtoken';
import { User } from '@src/users/entities/user.entity';
import { validateToken } from 'libs/validator/token.validator';
import { QuestionStatus } from '../entities/questionStatus.entity';
import { Question } from '../entities/question.entity';
import {
  GetQuestionRoundClickDto,
  QuestionDetailsDto,
  QuestionExplainsDto,
} from '../dto/round/getQuestionRoundClick.dto';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuestionStatus)
    private questionStatusRepository: Repository<QuestionStatus>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async createRound(createRoundDto: CreateRoundDto): Promise<Round> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(createRoundDto.categoryId) },
    });

    const round = new Round();

    if (createRoundDto.heldAt) {
      round.heldAt = convertYyyymmddToDate(createRoundDto.heldAt);
    }
    round.name = createRoundDto.name;
    round.category = category;
    return this.roundRepository.save(round);
  }

  /**
   * @description Round 클릭 시, question 단일 조회
   * - 로그인 하지 않았거나 로그인 했지만 처음으로 ROUND를 클릭했을 때 해당 ROUND의 첫번째 문제로
   * - 로그인 했고 중간에 풀다가 나갔다 다시 들어왔을 때 마지막으로 풀었던 문제로
   */
  async getQuestionRoundClick(
    roundId: string,
    token: string,
  ): Promise<GetQuestionRoundClickDto> {
    checkNumberString(roundId);
    let question: Question;

    if (token && validateToken(token)) {
      const user = await this.userRepository.findOne({
        where: { uuid: decode(token)['uuid'] },
      });

      const lastQuestionStatus = await this.questionStatusRepository.findOne({
        relations: ['question'],
        where: {
          roundId: Number(roundId),
          isLast: true,
          user: { id: user.id },
        },
      });

      if (!lastQuestionStatus) {
        question = await this.questionRepository.findOne({
          relations: ['details', 'explains', 'explains.question'],
          where: { round: { id: Number(roundId) } },
          order: { id: 'ASC' },
        });
      } else {
        question = await this.questionRepository.findOne({
          relations: ['details', 'explains', 'explains.question'],
          where: { id: lastQuestionStatus.question.id },
        });
      }
    } else {
      question = await this.questionRepository.findOne({
        relations: ['details', 'explains', 'explains.question'],
        where: { round: { id: Number(roundId) } },
        order: { id: 'ASC' },
      });
    }

    if (!question) {
      throw new Error('Question not found');
    }

    const dto = new GetQuestionRoundClickDto();
    dto.id = question.id;
    dto.title = question.title;
    dto.content = question.content;
    dto.createdAt = question.createdAt;
    dto.details = question.details.map((detail) => {
      const detailDto = new QuestionDetailsDto();
      Object.assign(detailDto, detail);
      return detailDto;
    });
    dto.explains = question.explains.map((explain) => {
      const explainDto = new QuestionExplainsDto();
      Object.assign(explainDto, explain);
      return explainDto;
    });

    return dto;
  }

  async getSpecificQuestion(
    questionId: string,
  ): Promise<GetQuestionRoundClickDto> {
    // questionId로 질문 조회 로직 구현
    const question = await this.questionRepository.findOne({
      relations: ['details', 'explains', 'explains.question'],
      where: { id: Number(questionId) },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    const dto = new GetQuestionRoundClickDto();
    dto.id = question.id;
    dto.title = question.title;
    dto.content = question.content;
    dto.createdAt = question.createdAt;
    dto.details = question.details.map((detail) => {
      const detailDto = new QuestionDetailsDto();
      Object.assign(detailDto, detail);
      return detailDto;
    });
    dto.explains = question.explains.map((explain) => {
      const explainDto = new QuestionExplainsDto();
      Object.assign(explainDto, explain);
      return explainDto;
    });

    return dto;
  }

  async updateRound(updateRoundDto: UpdateRoundDto, id: string) {
    checkNumberString(id);
    const round = await this.roundRepository.findOne({
      where: { id: Number(id) },
    });

    if (updateRoundDto.heldAt) {
      round.heldAt = convertYyyymmddToDate(updateRoundDto.heldAt);
    }
    round.name = updateRoundDto.name;

    return this.roundRepository.save(round);
  }

  async deleteRound(id: string) {
    checkNumberString(id);
    const round = await this.roundRepository.findOne({
      where: { id: Number(id) },
    });

    round.deletedAt = new Date();
    return this.categoryRepository.save(round);
  }
}
