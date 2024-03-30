import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateRoundDto } from '../dto/round/createRound.dto';
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

  //TODO: Round CRUD API 구현
  //TODO: GET 요청에 진행률도 같이 반환
  /**
   * @description Round 전체 조회
   * - 로그인한 사용자는 진행률도 같이 반환
   */
  @Get()
  async findAll() {
    this.logger.debug('Getting all rounds');
    return await this.roundService.getRounds();
  }
}
