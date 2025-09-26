import { Body, Controller, Post } from '@nestjs/common';
import { MessageRequest } from './dtos/conversation.dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { ConversationService } from './conversation.service';

@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly _conversationService: ConversationService) {}

    @Post('message')
    public submitMessage(@Body() messageRequest: MessageRequest) {
        return this._conversationService.submitMessage(messageRequest);
    }
}
