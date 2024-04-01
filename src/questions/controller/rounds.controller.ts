import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { UpdateRoundDto } from '../dto/round/updateRound.dto';
import { RoundsService } from '../service/rounds.service';

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
   */
  @Get(':id/question')
  @ApiBearerAuth('OAuth2PasswordBearer')
  async getQuestion(@Param('id') roundId: string, @Req() req: any) {
    this.logger.debug('Getting questions');
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;
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
