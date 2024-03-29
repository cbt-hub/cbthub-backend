import { ApiProperty, PickType } from '@nestjs/swagger';
import { Question } from '../entities/question.entity';

export class CreateQuestionDto extends PickType(Question, [
  'title',
  'content',
  'image',
]) {
  @ApiProperty({
    description: '질문 제목',
    example: `다음 중 올바른 설명으로 적절한 것은?`,
  })
  title: string;

  @ApiProperty({
    description: '질문 내용',
    example: `- 일반적으로 3.1~10.6GHz 대역에서, 
    기존의 스펙트럼에 비해 매우 넓은 대역에 결쳐 낮은 전력으로 \
    초고속 통신을 실현하는 근거리 무선 통신 기술이다.
    - 약 2나노초 길이의 펄스를 이용해 센티미터 단위의 정확도로 \
    거리를 측정할 수 있다.
    - 최근 사물인터넷의 발달로 위치와 거리를 정밀하게 측정 \
    하려는 수요가 늘어나면서 재부상했다.`,
  })
  content: string;

  @ApiProperty({
    description: '사진',
    example:
      'https://hellocbt.com/files/attach/images/2024/01/07/d3d842b45c93e061f889e40bbbc28da4.png',
  })
  image: string;
}
