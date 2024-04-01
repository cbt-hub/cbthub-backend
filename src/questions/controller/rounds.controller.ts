import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { RoundsService } from '../service/rounds.service';
import { UpdateRoundDto } from '../dto/round/updateRound.dto';

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
   * TODO: ROUND를 클릭 했을 때,
   * - 만약 유저가 처음으로 ROUND를 클릭하면 첫번째 문제로
   * - 만약 유저가 중간에 풀다가 나갔다 다시 들어오면 마지막으로 풀었던 문제로
   */

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
