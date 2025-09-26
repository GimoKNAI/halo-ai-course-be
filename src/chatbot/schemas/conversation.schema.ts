import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ConversationRole } from "../interfaces/conversation.interface";
import { Document } from "mongoose";

class Message {
  @Prop({ type: ConversationRole, required: true })
  role: ConversationRole;

  @Prop()
  message: string;
}

@Schema()
export class ConversationDocument extends Document {
  @Prop({ type: [Message], required: true })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(ConversationDocument);
