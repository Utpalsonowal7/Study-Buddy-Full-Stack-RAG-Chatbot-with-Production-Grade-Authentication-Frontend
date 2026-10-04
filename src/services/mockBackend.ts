import { DEMO_DATA, type StudyChat, type StudyData, type StudyDocument } from "../data/mockData";
import { readStorage, STORAGE_KEYS, writeStorage } from "../data/storage";

// Replace these simulated operations with fetch/axios calls when the API is available.
const pause = (ms = 280) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getStudyData(): Promise<StudyData> {
     await pause(180);
     const existing = readStorage<StudyData | null>(STORAGE_KEYS.data, null);
     if (existing) return existing;
     writeStorage(STORAGE_KEYS.data, DEMO_DATA);
     return DEMO_DATA;
}

async function saveStudyData(update: (data: StudyData) => StudyData): Promise<StudyData> {
     const current = await getStudyData();
     const next = update(current);
     writeStorage(STORAGE_KEYS.data, next);
     return next;
}

export async function uploadDocument(file: File): Promise<StudyDocument> {
     if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          throw new Error("Please choose a PDF file.");
     }
     if (file.size > 20 * 1024 * 1024) throw new Error("Files must be smaller than 20 MB.");
     const doc: StudyDocument = {
          id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type || "application/pdf",
          status: "processing", pages: 0, uploadedAt: new Date().toISOString(), topic: "Reading your document",
     };
     await saveStudyData((data) => ({ ...data, documents: [doc, ...data.documents] }));
     // Simulate an asynchronous indexing job; only metadata is kept in this demo.
     window.setTimeout(() => {
          void saveStudyData((data) => ({ ...data, documents: data.documents.map((item) => item.id === doc.id ? { ...item, status: "ready", pages: Math.max(1, Math.ceil(file.size / 45000)), topic: "Document indexed and ready to study" } : item) }));
     }, 2400);
     return doc;
}

export async function deleteDocument(id: string): Promise<void> {
     await saveStudyData((data) => ({ ...data, documents: data.documents.filter((doc) => doc.id !== id) }));
}

export async function createChat(): Promise<StudyChat> {
     const chat: StudyChat = { id: crypto.randomUUID(), title: "New study chat", updatedAt: new Date().toISOString(), messages: [] };
     await saveStudyData((data) => ({ ...data, chats: [chat, ...data.chats] }));
     return chat;
}

export async function askQuestion(chatId: string, question: string): Promise<StudyChat> {
     const data = await getStudyData();
     const ready = data.documents.filter((doc) => doc.status === "ready");
     const chosen = ready[0];
     const q = question.toLowerCase();
     let answer = chosen
          ? `Based on ${chosen.name}, ${q.includes("what") || q.includes("explain") ? "here is the key idea" : "the relevant point is"}: ${chosen.topic}. I can help break this down further or make a short revision summary.`
          : "Upload a PDF first and I can answer questions using its content. Your document will appear here once the simulated indexing step finishes.";
     if (q.includes("round robin") && chosen?.name.includes("Operating Systems")) answer = "Round-robin scheduling gives each process a fixed time slice (time quantum). When its quantum expires, the process moves to the back of the ready queue, giving processes a fair turn.";
     const now = new Date().toISOString();
     const citations = chosen ? [{ documentId: chosen.id, documentName: chosen.name, page: Math.max(1, Math.ceil(Math.random() * Math.max(chosen.pages, 1))), topic: chosen.topic.split(",")[0] }] : [];
     await pause(650);
     let result: StudyChat | undefined;
     await saveStudyData((current) => {
          const chat = current.chats.find((item) => item.id === chatId) ?? { id: chatId, title: question.slice(0, 36), updatedAt: now, messages: [] };
          const messages = [...chat.messages, { id: crypto.randomUUID(), role: "user" as const, content: question, createdAt: now }, { id: crypto.randomUUID(), role: "assistant" as const, content: answer, createdAt: new Date().toISOString(), citations }];
          result = { ...chat, title: chat.messages.length ? chat.title : question.slice(0, 36), updatedAt: new Date().toISOString(), messages };
          return { ...current, chats: [result, ...current.chats.filter((item) => item.id !== chatId)] };
     });
     return result!;
}
