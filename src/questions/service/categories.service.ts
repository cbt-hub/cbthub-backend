import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/createCategory.dto';
import { GetCategoryDto } from '../dto/category/getCategory.dto';
import { UpdateCategoryDto } from '../dto/category/updateCategory.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';
import { Round } from '../entities/round.entity';
import { GetRoundDto } from '../dto/round/getRound.dto';
import { decode } from 'jsonwebtoken';
import { User } from '@src/users/entities/user.entity';
import { validateToken } from 'libs/validator/token.validator';
import {
  QuestionStatus,
  QuestionStatusEnum,
} from '../entities/questionStatus.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(QuestionStatus)
    private questionStatusRepository: Repository<QuestionStatus>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async getCategories(): Promise<GetCategoryDto[]> {
    const categories = this.categoryRepository.find({
      where: { deletedAt: null },
    });
    return (await categories).map((category) => {
      const getCategoryDto = new GetCategoryDto();
      getCategoryDto.id = category.id;
      getCategoryDto.name = category.name;
      getCategoryDto.createdAt = category.createdAt;
      return getCategoryDto;
    });
  }

  async getCategory(id: string): Promise<GetCategoryDto> {
    checkNumberString(id);

    const category = this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    const getCategoryDto = new GetCategoryDto();
    getCategoryDto.name = (await category).name;
    getCategoryDto.createdAt = (await category).createdAt;
    return getCategoryDto;
  }

  /**
   * @description 진행률을 계산하여 getRoundDto[]를 반환
   * FIXME: 만약 회원이 문제를 푸는 와중에 question에 CRD가 일어난다면? 꼬임..
   * - 추후 수정 필요: 우선순위 중
   */
  async getRoundsInCategory(id: string, token: string): Promise<GetRoundDto[]> {
    checkNumberString(id);

    let isLogin = false;
    let userId;
    if (token && validateToken(token)) {
      isLogin = true;
      const user = await this.userRepository.findOne({
        where: { uuid: decode(token)['uuid'] },
      });
      userId = user.id;
    }

    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
      relations: ['rounds'],
    });

    return await Promise.all(
      category.rounds.map(async (round) => {
        const getRoundDto = new GetRoundDto();
        getRoundDto.id = round.id;
        getRoundDto.name = round.name;
        getRoundDto.heldAt = round.heldAt;
        getRoundDto.createdAt = round.createdAt;

        /**
         * @description 로그인 시 진행률 표시
         * - userId, roundId (round.id)
         * - 이 둘을 questionStatus에서 where 조건으로 검색하여
         * - SOLVED_CORRECT, SOLVED_WRONG, SOLVED_WRONG_CORRECT, SKIPPED의 개수를 구함
         */
        if (isLogin) {
          const [
            solvedCorrectCount,
            solvedWrongCount,
            solvedWrongCorrectCount,
            skippedCount,
          ] = await Promise.all([
            this.questionStatusRepository.count({
              where: {
                roundId: round.id,
                user: { id: userId },
                status: QuestionStatusEnum.SOLVED_CORRECT,
              },
            }),
            this.questionStatusRepository.count({
              where: {
                roundId: round.id,
                user: { id: userId },
                status: QuestionStatusEnum.SOLVED_WRONG,
              },
            }),
            this.questionStatusRepository.count({
              where: {
                roundId: round.id,
                user: { id: userId },
                status: QuestionStatusEnum.SOLVED_WRONG_CORRECT,
              },
            }),
            this.questionStatusRepository.count({
              where: {
                roundId: round.id,
                user: { id: userId },
                status: QuestionStatusEnum.SKIPPED,
              },
            }),
          ]);

          // 이 부분 소수점 첫째 자리에서 반올림 해 주세요.
          getRoundDto.progressRate = Math.round(
            (100 *
              (solvedCorrectCount +
                solvedWrongCount +
                solvedWrongCorrectCount)) /
              (solvedCorrectCount +
                solvedWrongCount +
                solvedWrongCorrectCount +
                skippedCount),
          );

          getRoundDto.skippedCount = skippedCount;
          getRoundDto.solvedWrongCount = solvedWrongCount;
          getRoundDto.solvedCorrectCount = solvedCorrectCount;
          getRoundDto.solvedWrongCorrectCount = solvedWrongCorrectCount;
        }

        return getRoundDto;
      }),
    );
  }

  async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
    id: string,
  ): Promise<Category> {
    checkNumberString(id);

    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    category.name = updateCategoryDto.name;
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<Category> {
    checkNumberString(id);

    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });
    category.deletedAt = new Date();
    return this.categoryRepository.save(category);
  }
}
