import { ApiProperty, PickType } from '@nestjs/swagger';
import { Category } from '@src/questions/entities/category.entity';

export class GetCategoryDto extends PickType(Category, ['name', 'createdAt']) {
  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: '카테고리 이름',
    example: '네트워크',
  })
  name: string;
  @ApiProperty({
    description: '생성 날짜',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
