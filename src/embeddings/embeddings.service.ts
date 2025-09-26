import { Injectable } from '@nestjs/common';
import { Candidate, ContentEmbedding, GoogleGenAI, Part } from '@google/genai';
import { ChromaClient } from 'chromadb';

import { AnswerDto, AnswerEntry } from '../survey/dtos/survey.dto';
import { SURVEY_QUESTIONS } from '../survey/consts/survey.consts';
import { SurveyResponse } from '../survey/schemas/survey-response.schema';
import { Conversation, Message } from '../chatbot/interfaces/conversation.interface';
import { surveyAnalysisPrompt } from '../chatbot/consts/prompts.const';

@Injectable()
export class EmbeddingsService {
    private readonly genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    private readonly chromaClient = new ChromaClient({
        host: "localhost",
        port: 8000,
        ssl: false
    });

    public async embedUserSurvey(submittedSurvay: SurveyResponse): Promise<void> {
        const surveyObject = submittedSurvay.toObject();
        const collection = await this.chromaClient.getOrCreateCollection({ name: "survey_collection" });

        const answerEmbedding: string[] = surveyObject.answers.map((answer: AnswerEntry) => {
            return `
        Name: ${surveyObject.userName}
        Survey Topic: ${answer.key}
        Question: ${SURVEY_QUESTIONS.find(({ topicKey }) => topicKey == answer.key)?.question}
        Answer: ${answer.value}
        Submitted date: ${this.formatEmbeddedDate(surveyObject.submittedAt)}
        Period start date: ${this.formatEmbeddedDate(surveyObject.periodStart)}
        Period end date: ${this.formatEmbeddedDate(surveyObject.periodEnd)}
        `;
        })

        const response = await this.genAI.models.embedContent({
            model: "gemini-embedding-001",
            contents: answerEmbedding,
        });

        const embeddings = response.embeddings ?? [];
        const vectors: number[][] = embeddings.map(e => e.values ?? []);

        for (let i = 0; i < vectors.length; i++) {
            await collection.add({
                ids: [`${surveyObject.userName}-${i}`],
                embeddings: [vectors[i]],
                metadatas: [{
                    docRefId: surveyObject._id.toString(),
                    userName: surveyObject.userName,
                    surveyKey: surveyObject.answers[i].key,
                    question: (SURVEY_QUESTIONS.find(({ topicKey }) => topicKey === surveyObject.answers[i].key)?.question) as string,
                    answer: surveyObject.answers[i].value,
                    submittedAt: surveyObject.submittedAt.toISOString(),
                    periodStart: surveyObject.periodStart.toISOString(),
                    periodEnd: surveyObject.periodEnd.toISOString(),
                }],
                documents: [answerEmbedding[i]]
            });
        }
    }

    public async queryBasedOnEmbeddings(messageQuery: string, history: Message[] = []): Promise<string> {
        if (history.length) {
            const chatHistoryText = history.map(msg => `${msg.role}: ${msg.message}`).join("\n");
            const prompt = `${chatHistoryText}\nNew query: ${messageQuery}`;
        }

        const embeddingResponse = await this.genAI.models.embedContent({
            model: "gemini-embedding-001",
            contents: [messageQuery],
        });

        const queryEmbedding = embeddingResponse.embeddings?.[0]?.values ?? [] as number[];

        const collection = await this.chromaClient.getOrCreateCollection({ name: "survey_collection" });

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 20,
            include: ["documents", "metadatas", "distances"],
        });

        const feedbacks: string = (results.documents[0] as string[]).join('\n');

        const userPromptParts: Part[] = [
            { text: `Survey related contents:\n${feedbacks}` },
            { text: `Query:\n${messageQuery}` },
        ]

        if (history.length) {
            userPromptParts.unshift({ text: `${this.buildChatHistory(history)}` })
        }

        const result = await this.genAI.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                temperature: 0.5,
            },
            contents: [
                // GeminiAPI don't allow a system role on contents, just 'model' and 'user' 
                {
                    role: "user",
                    parts: [{ text: surveyAnalysisPrompt }],
                },
                {
                    role: "user",
                    parts: userPromptParts
                },
            ],
        });

        return (result.candidates?.[0] as Candidate)?.content?.parts?.[0].text ?? '';
    }

    private formatEmbeddedDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    private buildChatHistory(messageList: Message[]): string {
        return messageList
            .map(msg => {
                const roleLabel = msg.role === 'user' ? 'User' : 'Assistant';
                return `${roleLabel}: ${msg.message}`;
            })
            .join('\n');
    }

}