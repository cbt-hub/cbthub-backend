import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateQuestionDetailsDto } from './dto/createQuestionDetails.dto';
import { CreateQuestionExplainsDto } from './dto/createQuestionExplains.dto';

@ApiTags('questions')
@Controller('v1/questions')
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  constructor(private readonly questionService: QuestionsService) {}

  /**
   * @description Question 생성
   */
  @Post()
  @Admin()
  @ApiBody({ type: CreateQuestionDto })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    this.logger.debug('Creating a question');
    return await this.questionService.createQuestion(createQuestionDto);
  }

  /**
   * @description QuestionDetails 생성
   */
  @Post(':id/details')
  @Admin()
  @ApiBody({ type: CreateQuestionDetailsDto, isArray: true })
  async createDetails(
    @Body() createQuestionDetailsDtos: CreateQuestionDetailsDto[],
    @Param('id') questionId: string,
  ) {
    this.logger.debug(
      `Creating many question details with createQuestionDetailsDtos : ${JSON.stringify(createQuestionDetailsDtos)}`,
    );
    return await this.questionService.createQuestionDetails(
      createQuestionDetailsDtos,
      questionId,
    );
  }

  /**
   * @description QuestionExplains 생성
   */
  @Post(':id/explains')
  @Admin()
  @ApiBody({ type: CreateQuestionExplainsDto, isArray: true })
  async createExplains(
    @Body() createQuestionExplainsDto: CreateQuestionExplainsDto[],
    @Param('id') questionId: string,
  ) {
    this.logger.debug('Creating a question explains');
    return await this.questionService.createQuestionExplains(
      createQuestionExplainsDto,
      questionId,
    );
  }
}