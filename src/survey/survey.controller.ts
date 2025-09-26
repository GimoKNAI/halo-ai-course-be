import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnswerDto } from './dtos/survey.dto';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {

    constructor(private readonly _surveyService: SurveyService){}

    @Post("submit")
    public submitAnswers(@Body() body: AnswerDto) {
        return this._surveyService.submitSurvey(body);
    }

    @Get("submitted/:userName")
    public getSubmittedAnswers(@Param('userName') userName: string) {
        console.log(userName);
    } 
}
