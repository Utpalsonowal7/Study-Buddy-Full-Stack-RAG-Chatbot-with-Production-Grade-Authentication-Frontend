import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { FiArrowRight, FiBookOpen, FiFileText, FiMessageSquare, FiPlus, FiUpload } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { getStudyData } from "../services/rag";
import { getApiErrorMessage } from "../services/auth";
import type { StudyData } from "../types/study";

function getGreeting() {
     const hour = new Date().getHours();
     return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function relativeTime(iso: string) {
     const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
     return days < 1 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function Dashboard() {
     const { user } = useAuth();
     const [data, setData] = useState<StudyData | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

     const load = useCallback(async (force = false) => {
          try { setData(await getStudyData(force)); setError(""); }
          catch (e) { setError(getApiErrorMessage(e, "Your study space could not be loaded.")); }
          finally { setLoading(false); }
     }, []);

     useEffect(() => {
          let mounted = true;
          void getStudyData().then((workspace) => {
               if (mounted) { setData(workspace); setError(""); }
          }).catch((e: unknown) => {
               if (mounted) setError(getApiErrorMessage(e, "Your study space could not be loaded."));
          }).finally(() => { if (mounted) setLoading(false); });
          return () => { mounted = false; };
     }, []);

     const docs = data?.documents ?? [];
     const chats = data?.chats ?? [];
     const chunks = docs.reduce((sum, doc) => sum + doc.chunkCount, 0);

     return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <section className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-short">Your study space</p><h1 className="mt-2 text-3xl font-medium tracking-tight text-title sm:text-4xl">{getGreeting()}, {user?.name?.split(" ")[0] ?? "there"}.</h1><p className="mt-2 text-lg">What would you like to study today?</p></div><Link to="/chat" className="flex items-center gap-2 rounded-lg bg-short px-5 py-3 font-semibold text-background transition hover:opacity-90"><FiPlus /> New conversation</Link></section>
          {error && <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300"><span>{error}</span><button onClick={() => void load(true)} className="font-semibold underline">Retry</button></div>}
          <section className="mt-9 grid gap-4 sm:grid-cols-3">{[{ label: "Documents loaded", value: loading || error ? "—" : docs.length, icon: FiFileText }, { label: "Chunks in loaded docs", value: loading || error ? "—" : chunks, icon: FiBookOpen }, { label: "Conversations loaded", value: loading || error ? "—" : chats.length, icon: FiMessageSquare }].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-cardBorder bg-dashBg p-5"><span className="grid size-11 place-items-center rounded-xl bg-short/10 text-xl text-short"><Icon /></span><div><p className="text-2xl font-semibold text-title">{value}</p><p className="text-sm">{label}</p></div></div>)}</section>
          <section className="mt-12"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-medium text-title">Pick up where you left off</h2><p className="mt-1 text-sm">Your recent conversations.</p></div><Link to="/chat" className="text-sm font-medium text-short hover:underline">All chats</Link></div>
               {loading ? <div className="rounded-2xl border border-cardBorder bg-dashBg p-7 text-sm">Loading conversations…</div> : error ? null : chats.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{chats.slice(0, 3).map((chat) => <Link key={chat.id} to={`/chat/${chat.id}`} className="group rounded-2xl border border-cardBorder bg-dashBg p-5 transition hover:border-short/50"><div className="flex items-start justify-between gap-3"><h3 className="truncate text-lg font-medium text-title">{chat.title}</h3><FiArrowRight className="mt-1 shrink-0 transition group-hover:translate-x-0.5 group-hover:text-short" /></div><p className="mt-2 text-sm">Continue this conversation with your study materials.</p><p className="mt-4 text-xs">Started {relativeTime(chat.updatedAt)}</p></Link>)}</div> : <div className="rounded-2xl border border-cardBorder bg-dashBg p-7 text-center"><p className="font-medium text-title">No conversations yet</p><Link to="/chat" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-short">Start your first chat <FiArrowRight /></Link></div>}
          </section>
          <section className="mt-12 rounded-2xl border border-cardBorder bg-cardBg p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-medium text-title">Your library</h2><p className="mt-1 text-sm">{loading ? "Loading documents…" : `${docs.length} documents · ${chunks} indexed chunks`}</p></div><Link to="/documents" className="flex items-center gap-2 rounded-lg border border-cardBorder px-4 py-2.5 text-sm font-semibold text-title transition hover:bg-navB"><FiUpload /> Manage documents</Link></div>
               {!loading && !error && docs.length > 0 && <div className="mt-5 grid gap-2 sm:grid-cols-2">{docs.slice(0, 4).map((doc) => <Link to="/documents" key={doc.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-cardBorder bg-dashBg px-3 py-3"><FiFileText className="shrink-0 text-short" /><span className="min-w-0 flex-1 truncate text-sm font-medium text-title">{doc.name}</span><span className="text-xs text-muted">{doc.chunkCount} chunks</span></Link>)}</div>}
               {!loading && !error && docs.length === 0 && <div className="mt-5 rounded-xl border border-dashed border-cardBorder p-6 text-center text-sm">No documents yet. <Link to="/documents" className="font-medium text-short hover:underline">Upload your first document</Link></div>}
          </section>
     </div>;
}
