import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '@src/questions/entities/category.entity';

export class CreateCategoryDto extends PickType(Category, ['name']) {
  @ApiProperty({
    description: '카테고리 이름',
    example: '리눅스마스터2급',
  })
  name: string;
}
