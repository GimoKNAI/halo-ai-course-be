import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { ConversationDocument, ConversationSchema } from './schemas/conversation.schema';
import { ChatbotController } from './chatbot.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConversationDocument.name, schema: ConversationSchema }]),
  ],
  controllers: [ChatbotController],
  providers: [ConversationService, EmbeddingsService],
  exports: [],
})
export class ChatbotModule {}
