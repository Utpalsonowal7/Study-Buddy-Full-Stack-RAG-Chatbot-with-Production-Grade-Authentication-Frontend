import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FiArrowUp, FiBookOpen, FiFileText, FiMessageSquare, FiPlus, FiTrash2 } from "react-icons/fi";
import type { ChatMessage, StudyChat, StudyData } from "../types/study";
import { deleteConversation, getConversationMessages, getStudyData, streamQuestion } from "../services/rag";
import { getApiErrorMessage } from "../services/auth";
import ChatMessageContent from "../components/ChatMessageContent";
import { StudyBuddyMark } from "../components/StudyBuddyLogo";

const temporaryId = () => `pending-${crypto.randomUUID()}`;

export default function Chat() {
     const { chatId } = useParams();
     const navigate = useNavigate();
     const [data, setData] = useState<StudyData | null>(null);
     const [active, setActive] = useState<StudyChat | null>(null);
     const [question, setQuestion] = useState("");
     const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
     const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
     const [loadedPath, setLoadedPath] = useState<string | null | undefined>(undefined);
     const [retryKey, setRetryKey] = useState(0);
     const [sending, setSending] = useState(false);
     const [error, setError] = useState("");
     const [errorCanReload, setErrorCanReload] = useState(false);
     const abortRef = useRef<AbortController | null>(null);
     const bottom = useRef<HTMLDivElement>(null);

     const loading = loadedPath !== (chatId ?? null);
     useEffect(() => {
          let mounted = true;
          void (async () => {
               try {
                    const workspace = await getStudyData();
                    if (!mounted) return;
                    setData(workspace); setError(""); setErrorCanReload(false);
                    if (!chatId) { setActive(null); return; }
                    const history = await getConversationMessages(chatId);
                    const conversation = workspace.chats.find((item) => item.id === chatId);
                    if (mounted) setActive({ id: chatId, title: conversation?.title ?? "Study conversation", updatedAt: conversation?.updatedAt ?? history.at(-1)?.createdAt ?? new Date().toISOString(), messages: history });
               } catch (e) {
                    if (mounted) { setActive(null); setError(getApiErrorMessage(e, "This conversation couldn't be loaded.")); setErrorCanReload(true); }
               } finally {
                    if (mounted) setLoadedPath(chatId ?? null);
               }
          })();
          return () => { mounted = false; };
     }, [chatId, retryKey]);
     useEffect(() => () => abortRef.current?.abort(), []);
     useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages?.length, pendingMessages.length, sending]);

     const startChat = () => {
          abortRef.current?.abort();
          setActive(null); setPendingMessages([]); setQuestion(""); setError(""); setErrorCanReload(false);
          if (chatId) navigate("/chat");
     };

     const removeConversation = async (chat: StudyChat) => {
          if (!window.confirm(`Delete the conversation “${chat.title}”?`)) return;
          try {
               await deleteConversation(chat.id);
               setData((current) => current ? { ...current, chats: current.chats.filter((item) => item.id !== chat.id) } : current);
               if (chat.id === chatId) { setActive(null); navigate("/chat", { replace: true }); }
          } catch (e) { setError(getApiErrorMessage(e, "The conversation couldn't be deleted.")); setErrorCanReload(false); }
     };

     const submit = async (event: FormEvent) => {
          event.preventDefault();
          const prompt = question.trim();
          if (!prompt || sending) return;
          if (prompt.length > 2000) { setError("Questions must be 2,000 characters or fewer."); return; }
          setError(""); setErrorCanReload(false); setSending(true);
          const draftUser: ChatMessage = { id: temporaryId(), role: "user", content: prompt, createdAt: new Date().toISOString(), citations: [] };
          const draftAssistant: ChatMessage = { id: temporaryId(), role: "assistant", content: "", createdAt: new Date().toISOString(), citations: [] };
          setPendingMessages([draftUser, draftAssistant]);
          const controller = new AbortController(); abortRef.current = controller;
          try {
               const result = await streamQuestion({
                    question: prompt,
                    conversationId: chatId,
                    documentIds: selectedDocumentIds,
                    signal: controller.signal,
                    onMeta: (meta) => setPendingMessages((current) => current.map((item) => item.id === draftAssistant.id ? { ...item, citations: meta.sources } : item)),
                    onDelta: (text) => setPendingMessages((current) => current.map((item) => item.id === draftAssistant.id ? { ...item, content: item.content + text } : item)),
               });
               const assistantMessage: ChatMessage = { ...draftAssistant, id: result.messageId, content: result.answer, citations: result.sources };
               const nextChat: StudyChat = {
                    id: result.conversationId,
                    title: active?.title ?? prompt.slice(0, 100),
                    updatedAt: new Date().toISOString(),
                    messages: [...(active?.messages ?? []), draftUser, assistantMessage],
               };
               setActive(nextChat); setPendingMessages([]); setQuestion("");
               if (result.conversationId !== chatId) navigate(`/chat/${result.conversationId}`, { replace: true });
               void getStudyData(true).then(setData).catch((e: unknown) => setError(getApiErrorMessage(e, "Conversation saved, but the recent chat list couldn't refresh.")));
          } catch (e) {
               setPendingMessages([]);
               if (!(e instanceof DOMException && e.name === "AbortError")) { setError(getApiErrorMessage(e, "The answer couldn't be completed. Please retry.")); setErrorCanReload(false); }
          } finally { setSending(false); abortRef.current = null; }
     };

     const messages = [...(active?.messages ?? []), ...pendingMessages];

     return <div className="flex min-h-full">
          <aside className="hidden w-64 shrink-0 border-r border-cardBorder bg-cardBg p-4 md:block">
               <button onClick={startChat} className="flex w-full items-center justify-center gap-2 rounded-lg bg-short px-4 py-2.5 text-sm font-semibold text-background"><FiPlus /> New chat</button>
               <p className="mb-2 mt-7 px-2 text-xs font-medium uppercase tracking-wider">Recent chats</p>
               <div className="space-y-1">{(data?.chats ?? []).map((chat) => <div key={chat.id} className={`group flex items-center gap-1 rounded-lg ${chat.id === chatId ? "bg-dashBg text-title ring-1 ring-cardBorder" : "hover:bg-navB"}`}><Link to={`/chat/${chat.id}`} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm"><FiMessageSquare className="shrink-0" /><span className="truncate">{chat.title}</span></Link><button title={`Delete ${chat.title}`} aria-label={`Delete ${chat.title}`} onClick={() => void removeConversation(chat)} className="mr-1 grid size-7 shrink-0 place-items-center rounded text-muted opacity-0 hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100"><FiTrash2 /></button></div>)}</div>
               <Link to="/documents" className="mt-7 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-navB"><FiFileText /> Browse documents</Link>
          </aside>
          <section className="flex min-w-0 flex-1 flex-col">
               <header className="border-b border-cardBorder px-5 py-4 sm:px-8"><p className="text-xs font-medium uppercase tracking-[0.16em] text-short">Study chat</p><h1 className="mt-1 truncate text-xl font-medium text-title">{active?.title ?? "Ask your study materials"}</h1></header>
               {error && <div role="alert" className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300 sm:mx-8"><span>{error}</span><button onClick={() => errorCanReload ? setRetryKey((key) => key + 1) : setError("")} className="font-semibold underline">{errorCanReload ? "Reload conversation" : "Dismiss"}</button></div>}
               <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8"><div className="mx-auto max-w-3xl space-y-7">
                    {loading ? <p className="py-16 text-center text-sm">Loading your conversation…</p> : messages.length ? messages.map((message) => <article key={message.id} className={message.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-short/10 px-4 py-3 text-title" : "max-w-3xl"}>
                         {message.role === "assistant" && <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-title"><StudyBuddyMark size={24} />Study Buddy</div>}
                         <ChatMessageContent content={message.content || (sending ? "Thinking…" : "")} />
                         {message.citations.map((citation, index) => <details key={`${message.id}-${index}`} className="mt-3 rounded-lg border border-cardBorder bg-dashBg text-xs"><summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2"><FiBookOpen className="text-short" /><span className="font-medium text-title">[{citation.citation}] {citation.documentName}</span><span>{citation.page ? `Page ${citation.page}` : `Chunk ${citation.chunk}`}</span></summary><p className="border-t border-cardBorder px-3 py-2 leading-relaxed">{citation.text}</p></details>)}
                    </article>) : <div className="mx-auto max-w-xl py-16 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-short/10 text-2xl text-short"><FiBookOpen /></span><h2 className="mt-5 text-2xl font-medium text-title">Study with your own materials</h2><p className="mt-2">Ask a question below. Answers are streamed from your documents with source citations.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{["Explain the key idea in my notes", "Summarize my document", "What should I revise first?"].map((prompt) => <button key={prompt} onClick={() => setQuestion(prompt)} className="rounded-full border border-cardBorder px-3 py-2 text-sm hover:border-short/50 hover:text-title">{prompt}</button>)}</div>{!data?.documents.length && <Link to="/documents" className="mt-5 inline-block text-sm font-medium text-short hover:underline">Upload a document to get started</Link>}</div>}
                    <div ref={bottom} />
               </div></div>
               <form onSubmit={(e) => void submit(e)} className="border-t border-cardBorder bg-background p-4 sm:px-8">
                    {Boolean(data?.documents.length) && <label className="mx-auto mb-2 block max-w-3xl text-xs">Limit answer to selected documents (optional)<select multiple value={selectedDocumentIds} onChange={(e) => { const ids = Array.from(e.currentTarget.selectedOptions, (option) => option.value); if (ids.length <= 20) { setSelectedDocumentIds(ids); setError(""); } else setError("Select no more than 20 documents for one question."); }} className="mt-1 block max-h-24 w-full rounded-lg border border-cardBorder bg-dashBg px-2 py-1.5 text-xs text-title">{data?.documents.map((doc) => <option key={doc.id} value={doc.id}>{doc.name}</option>)}</select></label>}
                    <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-cardBorder bg-dashBg p-2 focus-within:border-short"><textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder="Ask about your study material…" className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-title outline-none placeholder:text-muted" /><button disabled={!question.trim() || sending || loading} aria-label="Send question" className="grid size-10 shrink-0 place-items-center rounded-lg bg-short text-lg text-background hover:opacity-90 disabled:opacity-40"><FiArrowUp /></button></div><p className="mx-auto mt-2 max-w-3xl text-xs">Questions are limited to 2,000 characters.</p>
               </form>
          </section>
     </div>;
}
