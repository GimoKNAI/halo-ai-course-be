import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationDocument } from './schemas/conversation.schema';
import { Model } from 'mongoose';
import { Conversation, ConversationRole } from './interfaces/conversation.interface';
import { MessageRequest } from './dtos/conversation.dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { Types } from "mongoose";

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(ConversationDocument.name) private readonly conversationModel: Model<ConversationDocument>,
        private readonly _embeddingService: EmbeddingsService
    ) { }

    public async submitMessage(messageRequest: MessageRequest): Promise<ConversationDocument> {
        const storedConversation = messageRequest.conversationId != '' ? (await this.conversationModel.findById(messageRequest.conversationId))?.toObject() as Conversation : null;

        if (!storedConversation) {
            const response = await this._embeddingService.queryBasedOnEmbeddings(messageRequest.message, []);

            const createdConversation = new this.conversationModel({
                messages: [
                    {
                        role: ConversationRole.User,
                        message: messageRequest.message,
                    },
                    {
                        role: ConversationRole.System,
                        message: response,
                    }
                ]
            })

            return createdConversation.save();
        }

        const response = await this._embeddingService.queryBasedOnEmbeddings(messageRequest.message, storedConversation.messages);

        const storedConversationObjectId = new Types.ObjectId(storedConversation._id);

        await this.conversationModel.updateOne(
            { _id: storedConversationObjectId },
            { $push: { messages: { role: ConversationRole.User, message: messageRequest.message } } },
        );

        const updatedConversation = await this.conversationModel.findByIdAndUpdate(
            storedConversationObjectId,
            { $push: { messages: { role: ConversationRole.Assistant, message: response } } },
            { new: true }
        );

        return updatedConversation as ConversationDocument;
    }
}
