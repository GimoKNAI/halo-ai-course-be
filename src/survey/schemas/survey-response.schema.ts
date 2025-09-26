import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SurveyTopicKey } from '../interfaces/survey.interface';

class Answer {
  @Prop({ required: true })
  surveyTopicKey: SurveyTopicKey;

  @Prop()
  answerText: string;
}

@Schema({ timestamps: true })
export class SurveyResponse extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userName: String;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop({ type: [Answer], required: true })
  answers: Answer[];

  @Prop({ required: true })
  submittedAt: Date;
}

export const SurveyResponseSchema = SchemaFactory.createForClass(SurveyResponse);
