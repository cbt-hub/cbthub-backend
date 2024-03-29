import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './createQuestion.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
