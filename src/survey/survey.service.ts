import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SurveyResponse } from './schemas/survey-response.schema';
import { Model } from 'mongoose';
import { AnswerDto, AnswerEntry } from './dtos/survey.dto';
import { SurveyTopicKey } from './interfaces/survey.interface';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class SurveyService {
    constructor(
        @InjectModel(SurveyResponse.name) private readonly surveyModel: Model<SurveyResponse>,
        private readonly _embeddingService: EmbeddingsService,
    ) { }

    async submitSurvey(surveyPayload: AnswerDto): Promise<SurveyResponse> {
        if (surveyPayload.answers.length != 10) {
            throw new BadRequestException('Unable to process your request based on survey.');
        }

        this.validateAnswers(surveyPayload.answers);

        const createdSurvey = new this.surveyModel({
            userName: surveyPayload.userName,
            answers: surveyPayload.answers,
            periodStart: new Date(2025, 0, 1),
            periodEnd: new Date(2026, 0, 1),
            submittedAt: new Date(),
        });

        const submittedSurvey = await createdSurvey.save();

        this._embeddingService.embedUserSurvey(submittedSurvey);

        return submittedSurvey
    }

    async findByUser(userName: string): Promise<SurveyResponse[]> {
        return this.surveyModel.find({ userName }).exec();
    }


    private validateAnswers(answers: AnswerEntry[]): void {
        answers.forEach((answer, i) => {
            if (!Object.values(SurveyTopicKey).includes(answer.key as SurveyTopicKey)) {
            throw new Error(`Answer at index ${i} has invalid key: ${answer.key}`);
            }
            if (typeof answer.value !== 'string') {
            throw new Error(`Answer at index ${i} has invalid text type`);
            }
        });
    }
}