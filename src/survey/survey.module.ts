import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { SurveyResponse, SurveyResponseSchema } from './schemas/survey-response.schema';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SurveyResponse.name, schema: SurveyResponseSchema }]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService, EmbeddingsService],
  exports: [SurveyService],
})
export class SurveyModule {}
