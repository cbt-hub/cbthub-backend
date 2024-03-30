import { Injectable } from '@nestjs/common';
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

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionDetails)
    private questionDetailsRepository: Repository<QuestionDetails>,
    @InjectRepository(QuestionExplains)
    private questionExplainsRepository: Repository<QuestionExplains>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

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
}
