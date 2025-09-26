export enum ConversationRole {
    User = 'user',
    System = 'system',
    Assistant = 'assistant'
}

export interface Message {
    role: ConversationRole,
    message: string,
}

export interface Conversation {
    _id: string;
    messages: Message[];
}
