import { Module } from '@nestjs/common';
import { QuestionsController } from './controller/questions.controller';
import { QuestionsService } from './service/questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionDetails } from './entities/questionDetails.entity';
import { QuestionExplains } from './entities/questionExplains.entity';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';
import { Category } from './entities/category.entity';
import { Round } from './entities/round.entity';
import { QuestionStatus } from './entities/questionStatus.entity';
import { RoundsController } from './controller/rounds.controller';
import { User } from '@src/users/entities/user.entity';
import { RoundsService } from './service/rounds.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionDetails,
      QuestionExplains,
      Category,
      Round,
      QuestionStatus,
      User,
    ]),
  ],
  controllers: [QuestionsController, CategoriesController, RoundsController],
  providers: [QuestionsService, CategoriesService, RoundsService],
})
export class QuestionsModule {}
