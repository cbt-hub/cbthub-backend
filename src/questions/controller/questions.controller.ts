import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from '../service/questions.service';
import { CreateQuestionDto } from '../dto/question/createQuestion.dto';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateQuestionDetailsDto } from '../dto/question/createQuestionDetails.dto';
import { CreateQuestionExplainsDto } from '../dto/question/createQuestionExplains.dto';

/**
 * @link https://excalidraw.com/#json=1ZKrvXZRx7clx7yYYtq0p,jvYKLo94e6wsseSrPHuNpw
 * - 로그인 여부에 따라 question_solve 시 다른 로직을 타야 한다.
 * - 해당 회차(round)를 처음 풀었는지 여부에 따라 다른 로직을 타야 한다.
 */
@ApiTags('questions')
@Controller('v1/questions')
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  constructor(private readonly questionService: QuestionsService) {}

  /**
   * @description Question 생성
   * TODO: 이미지 업로드 기능 추가 - Azure Storage Blob 사용할 것임
   * - MultiPartFormData 사용하여 이미지 업로드 해야 한다.
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

  /**
   * TODO: Question 조회 기능 추가
   * @description Question 조회
   * - QuestionDetails, QuestionExplains도 함께 조회
   */

  /**
   * TODO: Question Status, Round, Category 엔티티 추가 및 CRUD 구현
   * - 진행률이 표시되게끔 구현한다.
   */
}
