export interface StudyDocument {
     id: string;
     name: string;
     type: string;
     size: number;
     chunkCount: number;
     createdAt: string;
}

export interface Citation {
     citation: number;
     documentId: string;
     documentName: string;
     chunk: number;
     page: number | null;
     text: string;
     score: number;
}

export interface ChatMessage {
     id: string;
     role: "user" | "assistant";
     content: string;
     createdAt: string;
     citations: Citation[];
}

export interface StudyChat {
     id: string;
     title: string;
     updatedAt: string;
     messages?: ChatMessage[];
}

export interface StudyData {
     documents: StudyDocument[];
     chats: StudyChat[];
}

export interface ChatStreamMeta {
     conversationId: string;
     sources: Citation[];
}

export interface ChatStreamResult {
     conversationId: string;
     messageId: string;
     answer: string;
     sources: Citation[];
}
