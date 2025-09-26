import { IsNotEmpty, IsString } from "class-validator";

export class MessageRequest {
    @IsString()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}