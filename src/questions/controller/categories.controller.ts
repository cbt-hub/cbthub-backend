import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Admin } from 'libs/decorator/admin.decorator';
import { CreateCategoryDto } from '../dto/category/createCategory.dto';
import { CategoriesService } from '../service/categories.service';
import { UpdateCategoryDto } from '../dto/category/updateCategory.dto';

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

  /**
   * @description Category 전체 조회
   */
  @Get()
  async findAll() {
    this.logger.debug('Getting all categories');
    return await this.categoryService.getCategories();
  }

  /**
   * @description Category 단일 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug('Getting a category');
    return await this.categoryService.getCategory(id);
  }

  /**
   * @description Category 수정
   */
  @Put(':id')
  @Admin()
  @ApiBody({ type: UpdateCategoryDto })
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    this.logger.debug('Updating a category');
    return await this.categoryService.updateCategory(updateCategoryDto, id);
  }

  /**
   * @description Category 삭제 (소프트 삭제)
   */
  @Delete(':id')
  @Admin()
  async delete(@Param('id') id: string) {
    this.logger.debug('Deleting a category');
    return await this.categoryService.deleteCategory(id);
  }
}
