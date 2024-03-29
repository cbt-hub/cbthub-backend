import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CreateQuestionDetailsDto } from './dto/createQuestionDetails.dto';
import { QuestionDetails } from './entities/questionDetails.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionDetails)
    private questionDetailsRepository: Repository<QuestionDetails>,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const question = new Question();
    question.title = createQuestionDto.title;
    question.content = createQuestionDto.content;
    question.image = createQuestionDto.image;
    return this.questionRepository.save(question);
  }

  async createQuestionDetails(
    createQuestionDetailsDtos: CreateQuestionDetailsDto[],
    questionId: string,
  ) {
    // 만약 questionId가 숫자형의 string이 아니라면 BadRequestException을 던집니다.
    if (isNaN(Number(questionId))) {
      throw new BadRequestException('questionId must be a number');
    }

    const question = await this.questionRepository.findOne({
      where: { id: Number(questionId) },
    });

    return await createQuestionDetailsDtos.map((createQuestionDetailsDto) => {
      const questionDetails = new QuestionDetails();
      questionDetails.choice = createQuestionDetailsDto.choice;
      questionDetails.isCorrect = createQuestionDetailsDto.isCorrect;
      questionDetails.question = question;
      return this.questionDetailsRepository.save(questionDetails);
    });
  }
}
