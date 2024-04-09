import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { UpdateRoundDto } from '../dto/round/updateRound.dto';
import { RoundsService } from '../service/rounds.service';
import { GetQuestionRoundClickDto } from '../dto/round/getQuestionRoundClick.dto';

@ApiTags('rounds')
@Controller('v1/rounds')
export class RoundsController {
  private readonly logger = new Logger(RoundsController.name);
  constructor(private readonly roundService: RoundsService) {}

  /**
   * @description Round 생성
   */
  @Post()
  @Admin()
  @ApiBody({ type: CreateRoundDto })
  async create(@Body() createRoundDto: CreateRoundDto) {
    this.logger.debug('Creating a round');
    return await this.roundService.createRound(createRoundDto);
  }

  /**
   * @description Round 클릭 시, question 단일 조회
   * - 로그인 X ➡️ 첫번째 문제로
   * - 로그인 O, 처음 푸는 문제 ➡️ 첫번째 문제로
   * - 로그인 O, 풀었다가 다시 돌아온 경우 ➡️ 마지막으로 풀었던 문제로
   *
   * @param roundId
   * @param id - questionId
   * - 만약 questionId가 있으면 해당 questionId로 조회
   * - 없으면 유저가 풀었던 가장 마지막 문제로 조회
   */
  @Get(':roundId/question')
  @ApiBearerAuth('OAuth2PasswordBearer')
  @ApiQuery({ name: 'id', required: false })
  async getQuestion(
    @Param('roundId') roundId: string,
    @Query('id') questionId: string, // 쿼리스트링으로 questionId 받기
    @Req() req: any,
  ): Promise<GetQuestionRoundClickDto> {
    this.logger.debug('Getting questions');
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (questionId) {
      return await this.roundService.getSpecificQuestion(questionId);
    }

    return await this.roundService.getQuestionRoundClick(roundId, token);
  }

  /**
   * @description Round 수정
   */
  @Put(':id')
  @Admin()
  @ApiBody({ type: UpdateRoundDto })
  async update(
    @Body() updateRoundDto: UpdateRoundDto,
    @Param('id') id: string,
  ) {
    this.logger.debug('Updating a round');
    return await this.roundService.updateRound(updateRoundDto, id);
  }

  /**
   * @description Round 삭제 (소프트 삭제)
   */
  @Delete(':id')
  @Admin()
  async delete(@Param('id') id: string) {
    this.logger.debug('Deleting a round');
    return await this.roundService.deleteRound(id);
  }
}
