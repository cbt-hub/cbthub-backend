import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '@src/questions/entities/category.entity';

export class CreateCategoryDto extends PickType(Category, ['name']) {
  @ApiProperty({
    description: '카테고리 이름',
    example: '네트워크',
  })
  name: string;
}
