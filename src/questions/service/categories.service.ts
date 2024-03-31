import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/createCategory.dto';
import { GetCategoryDto } from '../dto/category/getCategory.dto';
import { UpdateCategoryDto } from '../dto/category/updateCategory.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';
import { Round } from '../entities/round.entity';
import { GetRoundDto } from '../dto/round/getRound.dto';
import { decode } from 'jsonwebtoken';
import { User } from '@src/users/entities/user.entity';
import { validateToken } from 'libs/validator/token.validator';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    return category.rounds.map((round) => {
      const getRoundDto = new GetRoundDto();
      getRoundDto.name = round.name;
      getRoundDto.heldAt = round.heldAt;
      getRoundDto.createdAt = round.createdAt;

      /**
       * @description 로그인 시 진행률 표시
       * - 진행률 : questionStatus : userId = 로그인 한 유
       */
      if (isLogin) {
      }
      return getRoundDto;
    });
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
