import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/category/createCategory.dto';
import { GetCategoryDto } from '../dto/category/getCategory.dto';
import { UpdateCategoryDto } from '../dto/category/updateCategory.dto';
import { checkNumberString } from 'libs/validator/numberString.validator';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
