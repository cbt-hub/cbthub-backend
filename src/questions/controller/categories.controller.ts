import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateCategoryDto } from '../dto/category/createCategory.dto';
import { CategoriesService } from '../service/categories.service';

@ApiTags('categories')
@Controller('v1/categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);
  constructor(private readonly categoryService: CategoriesService) {}

  /**
   * @description Category 생성
   */
  @Post()
  @Admin()
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.debug('Creating a category');
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // TODO: Category CRUD API 구현
}
