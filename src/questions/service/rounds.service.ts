import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from '../entities/round.entity';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { Category } from '../entities/category.entity';
import { convertYyyymmddToDate } from 'libs/utils/date.util';
import { GetRoundDto } from '../dto/round/getRound.dto';
import { UpdateRoundDto } from '../dto/round/updateRound.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createRound(createRoundDto: CreateRoundDto): Promise<Round> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(createRoundDto.categoryId) },
    });

    const round = new Round();

    if (createRoundDto.heldAt) {
      round.heldAt = convertYyyymmddToDate(createRoundDto.heldAt);
    }
    round.name = createRoundDto.name;
    round.category = category;
    return this.roundRepository.save(round);
  }

  async getRounds(): Promise<GetRoundDto[]> {
    const round = await this.roundRepository.find({
      relations: ['category'],
    });

    console.log(`round: ${JSON.stringify(round)}`);

    return null;
  }

  async updateRound(updateRoundDto: UpdateRoundDto, id: string) {
    checkNumberString(id);
    const round = await this.roundRepository.findOne({
      where: { id: Number(id) },
    });

    if (updateRoundDto.heldAt) {
      round.heldAt = convertYyyymmddToDate(updateRoundDto.heldAt);
    }
    round.name = updateRoundDto.name;

    return this.roundRepository.save(round);
  }
}
