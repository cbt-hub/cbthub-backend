import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from '../service/questions.service';
import { CreateQuestionDto } from '../dto/question/createQuestion.dto';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateQuestionDetailsDto } from '../dto/question/createQuestionDetails.dto';
import { CreateQuestionExplainsDto } from '../dto/question/createQuestionExplains.dto';
import { validateToken } from 'libs/validator/token.validator';
import { QuestionSolveDto } from '../dto/question/questionSolve.dto';
import { Auth } from 'libs/decorator/auth.decorator';

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
   * @description question 삭제
   */
  @Delete(':id')
  @Admin()
  async deleteQuestion(@Param('id') id: string): Promise<void> {
    await this.questionService.deleteQuestion(Number(id));
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
   * TODO: Question UD
   * TODO: QuestionExplains UD
   * TODO: QuestionDetails UD
   */

  /**
   * @description Question Solve
   * - 로그인 안 한 사용자: 로그인 페이지로 이동 O
   * - 로그인 한 사용자: 해당 회차(round)를 처음 풀었는지 여부에 따라 다른 로직
   */
  @Post(':id/solve')
  @ApiBearerAuth('OAuth2PasswordBearer')
  async solve(
    @Param('id') questionId: string,
    @Body() questionSolveDto: QuestionSolveDto,
    @Req() req: any,
  ) {
    this.logger.debug('Solving a question');

    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token || !validateToken(token)) {
      return { message: '로그인 페이지로 이동', questionId };
    }

    return await this.questionService.solveQuestion(
      questionId,
      questionSolveDto,
      token,
    );
  }

  /**
   * @description Question Status 조회
   */
  @Get(':id/status')
  @Auth()
  async getStatus(@Param('id') questionId: string, @Req() req: any) {
    this.logger.debug('Getting a question status');

    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    return await this.questionService.getQuestionStatus(questionId, token);
  }
}
