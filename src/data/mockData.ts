import type { User } from "../types/auth";

export interface StudyDocument {
     id: string;
     name: string;
     size: number;
     type: string;
     status: "ready" | "processing" | "failed";
     pages: number;
     uploadedAt: string;
     topic: string;
}

export interface ChatMessage {
     id: string;
     role: "user" | "assistant";
     content: string;
     createdAt: string;
     citations?: { documentId: string; documentName: string; page: number; topic: string }[];
}

export interface StudyChat {
     id: string;
     title: string;
     updatedAt: string;
     messages: ChatMessage[];
}

export interface StudyData {
     documents: StudyDocument[];
     chats: StudyChat[];
}

export const DEMO_USER: User = {
     id: "demo-user",
     name: "Utpal Sharma",
     email: "utpal@example.com",
     avatar: null,
     isVerified: true,
};

export const DEMO_DATA: StudyData = {
     documents: [
          { id: "doc-os", name: "Operating Systems.pdf", size: 2480000, type: "application/pdf", status: "ready", pages: 86, uploadedAt: "2026-10-01T08:00:00.000Z", topic: "CPU scheduling, processes, memory" },
          { id: "doc-dbms", name: "DBMS Notes.pdf", size: 1620000, type: "application/pdf", status: "ready", pages: 54, uploadedAt: "2026-09-30T12:30:00.000Z", topic: "Relational databases, SQL, normalization" },
          { id: "doc-cn", name: "Computer Networks.pdf", size: 3980000, type: "application/pdf", status: "processing", pages: 112, uploadedAt: "2026-10-04T09:20:00.000Z", topic: "Networking fundamentals" },
     ],
     chats: [
          { id: "chat-os", title: "Operating Systems", updatedAt: "2026-10-03T15:30:00.000Z", messages: [
               { id: "m-os-1", role: "user", content: "What is round-robin scheduling?", createdAt: "2026-10-03T15:28:00.000Z" },
               { id: "m-os-2", role: "assistant", content: "Round-robin scheduling gives each process a fixed time slice (time quantum). When its quantum expires, the process moves to the back of the ready queue. This gives each process a fair turn and works well for time-sharing systems.", createdAt: "2026-10-03T15:30:00.000Z", citations: [{ documentId: "doc-os", documentName: "Operating Systems.pdf", page: 42, topic: "CPU Scheduling" }] },
          ] },
          { id: "chat-dbms", title: "DBMS revision", updatedAt: "2026-10-02T11:00:00.000Z", messages: [
               { id: "m-db-1", role: "user", content: "Explain database normalization", createdAt: "2026-10-02T10:57:00.000Z" },
               { id: "m-db-2", role: "assistant", content: "Normalization organizes relational data to reduce duplication and prevent update anomalies. The common normal forms build on one another: 1NF requires atomic values, 2NF removes partial dependencies, and 3NF removes transitive dependencies.", createdAt: "2026-10-02T11:00:00.000Z", citations: [{ documentId: "doc-dbms", documentName: "DBMS Notes.pdf", page: 18, topic: "Normalization" }] },
          ] },
     ],
};
