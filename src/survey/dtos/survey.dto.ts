import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SurveyTopicKey } from "../interfaces/survey.interface";

export class AnswerEntry {
  @IsEnum(SurveyTopicKey)
  key: SurveyTopicKey;

  @IsString()
  value: string;
}

export class AnswerDto {
  @ValidateNested({ each: true })
  @Type(() => AnswerEntry)
  answers: AnswerEntry[];

  @IsString()
  @IsNotEmpty()
  userName: string;
}
