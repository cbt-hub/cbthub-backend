import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionDetails } from './entities/questionDetails.entity';
import { QuestionExplains } from './entities/questionExplains.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionDetails, QuestionExplains]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
