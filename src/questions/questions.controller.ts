import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateQuestionDetailsDto } from './dto/createQuestionDetails.dto';

@ApiTags('questions')
@Controller('v1/questions')
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  constructor(private readonly questionService: QuestionsService) {}

  @Post()
  @Admin()
  @ApiBody({ type: CreateQuestionDto })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    this.logger.debug('Creating a question');
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @Post(':questionId/details')
  @Admin()
  @ApiBody({ type: CreateQuestionDetailsDto, isArray: true })
  async createMany(
    @Body() createQuestionDetailsDtos: CreateQuestionDetailsDto[],
    @Param('questionId') questionId: string,
  ) {
    this.logger.debug(
      `Creating many question details with createQuestionDetailsDtos : ${JSON.stringify(createQuestionDetailsDtos)}`,
    );
    return await this.questionService.createQuestionDetails(
      createQuestionDetailsDtos,
      questionId,
    );
  }
}
