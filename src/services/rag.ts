import api, { backendUrl } from "../api/api";
import type { ChatMessage, ChatStreamMeta, ChatStreamResult, Citation, StudyChat, StudyData, StudyDocument } from "../types/study";
import { getApiErrorMessage } from "./auth";

const LIST_CACHE_MS = 20_000;
const MESSAGE_CACHE_MS = 30_000;
const DOWNLOAD_URL_CACHE_MS = 55_000;

interface CacheEntry<T> {
     data: T | null;
     expiresAt: number;
     inflight?: Promise<T>;
}

function cacheEntry<T>(): CacheEntry<T> {
     return { data: null, expiresAt: 0 };
}

const documentPageCache = new Map<number, CacheEntry<StudyDocument[]>>();
const conversationsCache = cacheEntry<StudyChat[]>();
const messageCache = new Map<string, CacheEntry<ChatMessage[]>>();
const downloadCache = new Map<string, { url: string; expiresAt: number }>();
export const STUDY_DATA_INVALIDATED = "study-buddy:data-invalidated";

function cached<T>(entry: CacheEntry<T>, loader: () => Promise<T>, ttl: number, force = false): Promise<T> {
     if (!force && entry.data && entry.expiresAt > Date.now()) return Promise.resolve(entry.data);
     if (entry.inflight) return entry.inflight;
     const request = loader();
     entry.inflight = request;
     return request.then((data) => {
          if (entry.inflight === request) {
               entry.data = data;
               entry.expiresAt = Date.now() + ttl;
          }
          return data;
     }).finally(() => {
          if (entry.inflight === request) entry.inflight = undefined;
     });
}

function mapDocument(raw: Record<string, unknown>): StudyDocument {
     return {
          id: String(raw.id),
          name: String(raw.filename ?? "Untitled document"),
          type: String(raw.content_type ?? "application/octet-stream"),
          size: Number(raw.size_bytes ?? 0),
          chunkCount: Number(raw.chunk_count ?? 0),
          createdAt: String(raw.created_at ?? new Date().toISOString()),
     };
}

function mapConversation(raw: Record<string, unknown>): StudyChat {
     return {
          id: String(raw.id),
          title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Study conversation",
          updatedAt: String(raw.created_at ?? new Date().toISOString()),
     };
}

function mapCitation(raw: Record<string, unknown>): Citation {
     return {
          citation: Number(raw.citation ?? 0),
          documentId: String(raw.document_id ?? ""),
          documentName: String(raw.filename ?? "Source document"),
          chunk: Number(raw.chunk ?? 0),
          page: typeof raw.page === "number" ? raw.page : null,
          text: String(raw.text ?? ""),
          score: Number(raw.score ?? 0),
     };
}

function mapMessage(raw: Record<string, unknown>): ChatMessage {
     const role = String(raw.role ?? "assistant").toLowerCase();
     return {
          id: String(raw.id),
          role: role === "user" ? "user" : "assistant",
          content: String(raw.content ?? ""),
          createdAt: String(raw.created_at ?? new Date().toISOString()),
          citations: Array.isArray(raw.sources) ? raw.sources.map((source) => mapCitation(source as Record<string, unknown>)) : [],
     };
}

export function invalidateStudyCaches(notify = true): void {
     documentPageCache.clear();
     conversationsCache.data = null;
     conversationsCache.expiresAt = 0;
     conversationsCache.inflight = undefined;
     messageCache.clear();
     downloadCache.clear();
     if (notify) window.dispatchEvent(new Event(STUDY_DATA_INVALIDATED));
}

export async function getDocuments(force = false): Promise<StudyDocument[]> {
     return getDocumentsPage(0, force);
}

export async function getDocumentsPage(offset: number, force = false): Promise<StudyDocument[]> {
     const safeOffset = Math.max(0, Math.floor(offset));
     let entry = documentPageCache.get(safeOffset);
     if (!entry) {
          entry = cacheEntry<StudyDocument[]>();
          documentPageCache.set(safeOffset, entry);
     }
     return cached(entry, async () => {
          const { data } = await api.get<unknown[]>("/rag/documents", { params: { offset: safeOffset, limit: 50 } });
          return data.map((item) => mapDocument(item as Record<string, unknown>));
     }, LIST_CACHE_MS, force);
}

export async function getConversations(force = false): Promise<StudyChat[]> {
     return cached(conversationsCache, async () => {
          const { data } = await api.get<unknown[]>("/rag/conversations", { params: { offset: 0, limit: 50 } });
          return data.map((item) => mapConversation(item as Record<string, unknown>));
     }, LIST_CACHE_MS, force);
}

export async function getStudyData(force = false): Promise<StudyData> {
     const [documents, chats] = await Promise.all([getDocuments(force), getConversations(force)]);
     return { documents, chats };
}

export async function getConversationMessages(conversationId: string, force = false): Promise<ChatMessage[]> {
     let entry = messageCache.get(conversationId);
     if (!entry) {
          entry = cacheEntry<ChatMessage[]>();
          messageCache.set(conversationId, entry);
     }
     return cached(entry, async () => {
          const { data } = await api.get<unknown[]>(`/rag/conversations/${encodeURIComponent(conversationId)}/messages`, { params: { after_id: 0, limit: 100 } });
          return data.map((item) => mapMessage(item as Record<string, unknown>));
     }, MESSAGE_CACHE_MS, force);
}

export async function getDocumentDetails(documentId: string): Promise<StudyDocument> {
     const { data } = await api.get<Record<string, unknown>>(`/rag/documents/${encodeURIComponent(documentId)}`);
     return mapDocument(data);
}

export async function getDocumentDownloadUrl(documentId: string): Promise<{ url: string; expiresAt: number }> {
     const cachedUrl = downloadCache.get(documentId);
     if (cachedUrl && cachedUrl.expiresAt > Date.now()) return cachedUrl;
     const { data } = await api.get<{ url: string; expires_in: number }>(`/rag/documents/${encodeURIComponent(documentId)}/download`);
     const url = new URL(data.url, backendUrl ?? window.location.origin).toString();
     const link = { url, expiresAt: Date.now() + Math.min(data.expires_in, DOWNLOAD_URL_CACHE_MS / 1000) * 1000 };
     downloadCache.set(documentId, link);
     return link;
}

export async function uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<StudyDocument> {
     const extension = file.name.split(".").pop()?.toLowerCase();
     if (!extension || !["pdf", "txt", "md"].includes(extension)) {
          throw new Error("Choose a PDF, TXT, or Markdown document.");
     }
     if (file.size === 0) throw new Error("The selected file is empty.");
     if (file.size > 10 * 1024 * 1024) throw new Error("This file exceeds the 10 MiB upload limit.");
     const form = new FormData();
     form.append("file", file, file.name);
     const { data } = await api.post<Record<string, unknown>>("/rag/documents", form, {
          onUploadProgress: (event) => {
               if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
          },
     });
     invalidateStudyCaches();
     return mapDocument(data);
}

export async function deleteDocument(documentId: string): Promise<void> {
     await api.delete(`/rag/documents/${encodeURIComponent(documentId)}`);
     downloadCache.delete(documentId);
     invalidateStudyCaches();
}

export async function deleteConversation(conversationId: string): Promise<void> {
     await api.delete(`/rag/conversations/${encodeURIComponent(conversationId)}`);
     invalidateStudyCaches();
}

async function startStream(payload: { question: string; conversation_id?: number; document_ids?: number[] }, signal?: AbortSignal): Promise<Response> {
     if (!backendUrl) throw new Error("VITE_BACKEND_URL is not configured.");
     const url = `${backendUrl}/rag/chat/stream`;
     const send = () => fetch(url, {
          method: "POST",
          credentials: "include",
          signal,
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify(payload),
     });
     let response = await send();
     if (response.status === 401) {
          const refreshed = await fetch(`${backendUrl}/auth/refresh`, { method: "POST", credentials: "include" });
          if (refreshed.ok) response = await send();
     }
     if (!response.ok) {
          let detail: unknown;
          try {
               const body = await response.json() as { detail?: unknown; message?: unknown };
               detail = body.detail ?? body.message;
          } catch { /* A non-JSON server error gets a status-based message below. */ }
          if (typeof detail === "string") throw new Error(detail);
          if (Array.isArray(detail)) {
               const message = detail.map((item) => (item as { msg?: string }).msg).filter(Boolean).join(" ");
               if (message) throw new Error(message);
          }
          throw new Error(`The chat request failed (${response.status}). Please try again.`);
     }
     if (!response.body) throw new Error("The server did not return a chat stream.");
     return response;
}

export async function streamQuestion(options: {
     question: string;
     conversationId?: string;
     documentIds?: string[];
     signal?: AbortSignal;
     onMeta?: (meta: ChatStreamMeta) => void;
     onDelta?: (text: string) => void;
}): Promise<ChatStreamResult> {
     const question = options.question.trim();
     if (!question) throw new Error("Enter a question first.");
     if (question.length > 2000) throw new Error("Questions must be 2,000 characters or fewer.");
     if (options.conversationId && (!Number.isSafeInteger(Number(options.conversationId)) || Number(options.conversationId) < 1)) {
          throw new Error("This conversation ID is invalid. Start a new chat and retry.");
     }
     if ((options.documentIds?.length ?? 0) > 20) throw new Error("Select no more than 20 documents for one question.");
     if (options.documentIds?.some((id) => !Number.isSafeInteger(Number(id)) || Number(id) < 1)) {
          throw new Error("One of the selected document IDs is invalid. Refresh the page and retry.");
     }
     const response = await startStream({
          question,
          ...(options.conversationId ? { conversation_id: Number(options.conversationId) } : {}),
          ...(options.documentIds?.length ? { document_ids: options.documentIds.map(Number) } : {}),
     }, options.signal);
     const reader = response.body!.getReader();
     const decoder = new TextDecoder();
     let buffer = "";
     let conversationId = options.conversationId ?? "";
     let messageId = "";
     let sources: Citation[] = [];
     let answer = "";
     let completed = false;

     const handleFrame = (frame: string) => {
          let eventName = "message";
          const dataLines: string[] = [];
          for (const line of frame.split(/\r?\n/)) {
               if (line.startsWith("event:")) eventName = line.slice(6).trim();
               else if (line.startsWith("data:")) dataLines.push(line.slice(5).replace(/^ /, ""));
          }
          if (!dataLines.length) return;
          let data: Record<string, unknown>;
          try { data = JSON.parse(dataLines.join("\n")) as Record<string, unknown>; }
          catch { throw new Error("The server sent an invalid chat stream event."); }
          if (eventName === "meta") {
               conversationId = String(data.conversation_id ?? conversationId);
               sources = Array.isArray(data.sources) ? data.sources.map((source) => mapCitation(source as Record<string, unknown>)) : [];
               options.onMeta?.({ conversationId, sources });
          } else if (eventName === "delta") {
               const text = String(data.text ?? "");
               answer += text;
               options.onDelta?.(text);
          } else if (eventName === "done") {
               conversationId = String(data.conversation_id ?? conversationId);
               messageId = String(data.message_id ?? "");
               completed = true;
          } else if (eventName === "error") {
               throw new Error(String(data.message ?? "The answer stream failed. Please retry."));
          }
     };

     try {
          while (true) {
               const { value, done } = await reader.read();
               if (done) break;
               buffer += decoder.decode(value, { stream: true });
               if (buffer.length > 2_000_000) throw new Error("The chat stream exceeded the allowed size.");
               let separator = buffer.search(/\r?\n\r?\n/);
               while (separator >= 0) {
                    const delimiter = buffer.slice(separator).match(/^\r?\n\r?\n/)?.[0] ?? "\n\n";
                    handleFrame(buffer.slice(0, separator));
                    buffer = buffer.slice(separator + delimiter.length);
                    separator = buffer.search(/\r?\n\r?\n/);
               }
          }
          buffer += decoder.decode();
          if (buffer.trim()) handleFrame(buffer);
     } catch (error) {
          await reader.cancel(error).catch(() => undefined);
          throw error;
     } finally {
          reader.releaseLock();
     }
     if (!completed || !conversationId || !messageId) throw new Error("The answer stream ended before it was saved. Please retry.");
     invalidateStudyCaches();
     return { conversationId, messageId, answer, sources };
}

export { getApiErrorMessage };
