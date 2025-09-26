import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyModule } from './survey/survey.module';
// import { EmbeddingsService } from './chroma-embeddings/embeddings/embeddings.service';
// import { EmbeddingsService } from './embeddings/embeddings.service';
import { ChatbotController } from './chatbot/chatbot.controller';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),

    SurveyModule,
    ChatbotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
