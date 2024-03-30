import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Round } from '../entities/round.entity';
import { CreateRoundDto } from '../dto/round/createRound.dto';
import { Category } from '../entities/category.entity';

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
    round.name = createRoundDto.name;
    round.heldAt = createRoundDto.heldAt;
    round.category = category;
    return this.roundRepository.save(round);
  }
}
