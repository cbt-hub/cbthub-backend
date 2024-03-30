import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/question/createQuestion.dto';
import { CreateQuestionDetailsDto } from '../dto/question/createQuestionDetails.dto';
import { QuestionDetails } from '../entities/questionDetails.entity';
import { QuestionExplains } from '../entities/questionExplains.entity';
import { CreateQuestionExplainsDto } from '../dto/question/createQuestionExplains.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';
import { Round } from '../entities/round.entity';
import { QuestionSolveDto } from '../dto/question/questionSolve.dto';
import { decode } from 'jsonwebtoken';
import { User } from '@src/users/entities/user.entity';
import {
  QuestionStatus,
  QuestionStatusEnum,
} from '../entities/questionStatus.entity';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionDetails)
    private questionDetailsRepository: Repository<QuestionDetails>,
    @InjectRepository(QuestionExplains)
    private questionExplainsRepository: Repository<QuestionExplains>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuestionStatus)
    private questionStatusRepository: Repository<QuestionStatus>,
  ) {}

  /**
   * @description Question 생성
   */
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const round = await this.roundRepository.findOne({
      where: { id: Number(createQuestionDto.roundId) },
    });

    const question = new Question();
    question.title = createQuestionDto.title;
    question.content = createQuestionDto.content;
    question.image = createQuestionDto.image;
    question.round = round;
    return this.questionRepository.save(question);
  }

  /**
   * @description QuestionDetails 생성
   */
  async createQuestionDetails(
    createQuestionDetailsDtos: CreateQuestionDetailsDto[],
    questionId: string,
  ) {
    checkNumberString(questionId);
    const question = await this.questionRepository.findOne({
      where: { id: Number(questionId) },
    });

    return Promise.all(
      createQuestionDetailsDtos.map((createQuestionDetailsDto) => {
        const questionDetails = new QuestionDetails();
        questionDetails.choice = createQuestionDetailsDto.choice;
        questionDetails.isCorrect = createQuestionDetailsDto.isCorrect;
        questionDetails.question = question;
        return this.questionDetailsRepository.save(questionDetails);
      }),
    );
  }

  /**
   * @description QuestionExplains 생성
   */
  async createQuestionExplains(
    createQuestionExplainsDto: CreateQuestionExplainsDto[],
    questionId: string,
  ) {
    checkNumberString(questionId);
    const question = await this.questionRepository.findOne({
      where: { id: Number(questionId) },
    });

    return Promise.all(
      createQuestionExplainsDto.map((createQuestionExplainsDto) => {
        const questionExplains = new QuestionExplains();
        questionExplains.type = createQuestionExplainsDto.type;
        questionExplains.explain = createQuestionExplainsDto.explain;
        questionExplains.question = question;
        return this.questionExplainsRepository.save(questionExplains);
      }),
    );
  }

  /**
   * @description 로그인 한 User가 Question 풀이
   */
  async solveQuestion(
    questionId: string,
    questionSolveDto: QuestionSolveDto,
    token: string,
  ) {
    checkNumberString(questionId);
    const userUuid = decode(token)['uuid'];

    // question 조회와 user 조회를 동시에 실행
    const [question, user] = await Promise.all([
      this.questionRepository.findOne({
        where: { id: Number(questionId) },
        relations: ['round'],
      }),
      this.userRepository.findOneBy({ uuid: userUuid }),
    ]);

    // questionId와 userId로 questionStatus 조회
    const isNotNullQuestionStatus = await this.questionStatusRepository.findOne(
      {
        where: { question: { id: question.id }, user: { id: user.id } },
      },
    );

    // 처음 푸는 문제인 경우, 해당 회차의 모든 문제에 대한 questionStatus 생성
    if (!isNotNullQuestionStatus) {
      const questions = await this.questionRepository.find({
        where: { round: { id: question.round.id } },
      });
      this.logger.debug(`questions: ${JSON.stringify(questions)}`);
      if (!questions || questions.length === 0) {
        throw new Error('해당하는 문제가 없습니다.');
      }

      await Promise.all(
        questions.map((question) => {
          const questionStatus = new QuestionStatus();
          questionStatus.question = question;
          questionStatus.user = user;
          return this.questionStatusRepository.save(questionStatus);
        }),
      );
    }

    /**
     * @description questionDetails와 questionStatus를 조회하여 채점
     * @link https://excalidraw.com/#json=-OCSQM1EgKGNC-POy12q_,Cbesr7h2NtFewDXSa6jUzA
     * - 채점 로직(표)
     */
    let status = QuestionStatusEnum.SKIPPED;
    const questionDetails = await this.questionDetailsRepository.findOne({
      where: { id: Number(questionSolveDto.questionDetailsId) },
    });
    if (!questionDetails) {
      throw new Error('해당하는 questionDetails가 없습니다.');
    }
    const questionStatus = await this.questionStatusRepository.findOne({
      where: { question: { id: question.id }, user: { id: user.id } },
    });
    if (!questionStatus) {
      throw new Error('해당하는 questionStatus가 없습니다.');
    }

    this.logger.debug(`questionDetails: ${JSON.stringify(questionDetails)}`);

    if (!questionDetails.isCorrect) {
      status = QuestionStatusEnum.SOLVED_WRONG;
    } else if (
      questionStatus.status === QuestionStatusEnum.SKIPPED ||
      questionStatus.status === QuestionStatusEnum.SOLVED_CORRECT
    ) {
      status = QuestionStatusEnum.SOLVED_CORRECT;
    } else {
      status = QuestionStatusEnum.SOLVED_WRONG_CORRECT;
    }

    // questionStatus 업데이트
    questionStatus.questionDetailsId = Number(
      questionSolveDto.questionDetailsId,
    );
    questionStatus.status = status;
    questionStatus.updatedAt = new Date();
    return this.questionStatusRepository.save(questionStatus);
  }
}
