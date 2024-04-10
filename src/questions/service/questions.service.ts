import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    if (!round) {
      throw new NotFoundException(
        `Round with ID ${createQuestionDto.roundId} not found`,
      );
    }

    // 해당 라운드에 속한 모든 문제들의 수를 찾습니다.
    const questionsCount = await this.questionRepository.count({
      where: { round: { id: round.id } },
    });

    const question = new Question();
    question.title = createQuestionDto.title;
    question.content = createQuestionDto.content;
    question.image = createQuestionDto.image;
    question.round = round;
    question.order = questionsCount + 1;

    return this.questionRepository.save(question);
  }

  /**
   * @description Question 삭제
   */
  async deleteQuestion(questionId: number): Promise<void> {
    // 삭제하려는 문제를 찾습니다.
    const questionToDelete = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['round'],
    });

    if (!questionToDelete) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // 문제를 삭제합니다.
    await this.questionRepository.softDelete({ id: questionId });

    // 삭제된 문제의 order 값보다 큰 모든 문제들의 order 값을 갱신합니다.
    await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .set({
        order: () => '`order` - 1', // order 값을 1 감소시킵니다.
      })
      .where('`order` > :order', { order: questionToDelete.order })
      .andWhere('`roundId` = :roundId', { roundId: questionToDelete.round.id })
      .execute();
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
    this.logger.debug(`question: ${JSON.stringify(question)}`);

    // questionId와 userId로 questionStatus 조회
    const isNotNullQuestionStatus = await this.questionStatusRepository.findOne(
      {
        where: { question: { id: question.id }, user: { id: user.id } },
      },
    );

    // 처음 푸는 문제인 경우, 해당 회차의 모든 문제에 대한 questionStatus 생성
    if (!isNotNullQuestionStatus) {
      this.logger.debug(`question.round.id: ${question.round.id}`);
      const questions = await this.questionRepository.find({
        where: { round: { id: question.round.id } },
      });
      this.logger.debug(`questions: ${JSON.stringify(questions)}`);
      if (!questions || questions.length === 0) {
        throw new Error('해당하는 문제가 없습니다.');
      }

      await Promise.all(
        questions.map((q) => {
          const questionStatus = new QuestionStatus();
          questionStatus.question = q;
          questionStatus.user = user;
          questionStatus.roundId = Number(question.round.id);
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

    // 마지막으로 푼 문제 기록
    const lastNums = await this.questionStatusRepository.find({
      where: { user: { id: user.id }, isLast: true },
    });

    if (lastNums.length > 0) {
      await Promise.all(
        lastNums.map(async (lastNum) => {
          lastNum.isLast = false;
          await this.questionStatusRepository.save(lastNum);
        }),
      );
    }

    // questionStatus 업데이트
    questionStatus.questionDetailsId = Number(
      questionSolveDto.questionDetailsId,
    );
    questionStatus.status = status;
    questionStatus.updatedAt = new Date();
    questionStatus.isLast = true; // 마지막으로 푼 문제 기록
    return this.questionStatusRepository.save(questionStatus);
  }
}
