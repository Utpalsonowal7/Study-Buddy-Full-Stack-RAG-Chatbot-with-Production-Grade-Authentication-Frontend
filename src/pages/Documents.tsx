import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheck, FiDownload, FiFileText, FiInfo, FiLoader, FiTrash2, FiUpload } from "react-icons/fi";
import { deleteDocument, getDocumentDetails, getDocumentDownloadUrl, getDocuments, getDocumentsPage, uploadDocument } from "../services/rag";
import { getApiErrorMessage } from "../services/auth";
import type { StudyDocument } from "../types/study";

const formatSize = (size: number) => size >= 1_000_000 ? `${(size / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1000))} KB`;

export default function Documents() {
     const [docs, setDocs] = useState<StudyDocument[]>([]);
     const [loading, setLoading] = useState(true);
     const [loadingMore, setLoadingMore] = useState(false);
     const [hasMore, setHasMore] = useState(false);
     const [nextOffset, setNextOffset] = useState(0);
     const [busy, setBusy] = useState(false);
     const [progress, setProgress] = useState(0);
     const [deletingId, setDeletingId] = useState<string | null>(null);
     const [error, setError] = useState("");
     const [notice, setNotice] = useState("");
     const [details, setDetails] = useState<StudyDocument | null>(null);
     const [detailsForId, setDetailsForId] = useState<string | null>(null);
     const [detailsLoading, setDetailsLoading] = useState(false);
     const [downloadLink, setDownloadLink] = useState<{ documentId: string; url: string; expiresAt: number } | null>(null);
     const fileRef = useRef<HTMLInputElement>(null);

     const refresh = useCallback(async (force = false) => {
          try {
               const firstPage = await getDocuments(force);
               setDocs(firstPage); setNextOffset(firstPage.length); setHasMore(firstPage.length === 50); setError("");
          }
          catch (e) { setError(getApiErrorMessage(e, "Documents couldn't be loaded.")); }
          finally { setLoading(false); }
     }, []);
     useEffect(() => {
          let mounted = true;
          void getDocuments().then((items) => {
               if (mounted) { setDocs(items); setNextOffset(items.length); setHasMore(items.length === 50); setError(""); }
          }).catch((e: unknown) => {
               if (mounted) setError(getApiErrorMessage(e, "Documents couldn't be loaded."));
          }).finally(() => { if (mounted) setLoading(false); });
          return () => { mounted = false; };
     }, []);

     const loadMore = async () => {
          if (loadingMore || !hasMore) return;
          setLoadingMore(true);
          try {
               const nextPage = await getDocumentsPage(nextOffset);
               setDocs((current) => [...current, ...nextPage.filter((item) => !current.some((existing) => existing.id === item.id))]);
               setNextOffset((offset) => offset + nextPage.length);
               if (nextPage.length < 50) setHasMore(false);
          } catch (e) { setError(getApiErrorMessage(e, "More documents couldn't be loaded.")); }
          finally { setLoadingMore(false); }
     };

     const upload = async (file?: File) => {
          if (!file) return;
          setError(""); setNotice(""); setProgress(0); setBusy(true);
          try {
               const document = await uploadDocument(file, setProgress);
               setNotice(`${document.name} was uploaded and indexed.`);
               await refresh(true);
          } catch (e) { setError(getApiErrorMessage(e, "The document couldn't be uploaded.")); }
          finally { setBusy(false); setProgress(0); if (fileRef.current) fileRef.current.value = ""; }
     };

     const remove = async (document: StudyDocument) => {
          if (!window.confirm(`Delete “${document.name}” and its indexed content?`)) return;
          setError(""); setDeletingId(document.id);
          try {
               await deleteDocument(document.id);
               setDocs((current) => current.filter((item) => item.id !== document.id));
               if (details?.id === document.id) setDetails(null);
               if (downloadLink?.documentId === document.id) setDownloadLink(null);
               await refresh(true);
          } catch (e) { setError(getApiErrorMessage(e, "The document couldn't be deleted.")); }
          finally { setDeletingId(null); }
     };

     const toggleDetails = async (document: StudyDocument) => {
          if (details?.id === document.id) { setDetails(null); return; }
          setDetails(null); setDetailsForId(document.id); setError(""); setDetailsLoading(true);
          try { setDetails(await getDocumentDetails(document.id)); }
          catch (e) { setError(getApiErrorMessage(e, "Document details couldn't be loaded.")); }
          finally { setDetailsLoading(false); setDetailsForId(null); }
     };

     const prepareDownload = async (document: StudyDocument) => {
          setError(""); setDownloadLink(null);
          try {
               const link = await getDocumentDownloadUrl(document.id);
               setDownloadLink({ documentId: document.id, ...link });
               window.setTimeout(() => setDownloadLink((current) => current?.documentId === document.id && current.expiresAt <= Date.now() ? null : current), Math.max(0, link.expiresAt - Date.now()));
          } catch (e) { setDownloadLink(null); setError(getApiErrorMessage(e, "The download link couldn't be prepared.")); }
     };

     const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          if (!busy) void upload(event.dataTransfer.files[0]);
     };

     return <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium uppercase tracking-[0.16em] text-short">Your library</p><h1 className="mt-2 text-3xl font-medium tracking-tight text-title sm:text-4xl">Documents</h1><p className="mt-2">Upload and manage the materials your study chats can use.</p></div>
               <button onClick={() => fileRef.current?.click()} disabled={busy} className="flex items-center gap-2 rounded-lg bg-short px-4 py-3 font-semibold text-background hover:opacity-90 disabled:opacity-60"><FiUpload />{busy ? `Uploading… ${progress}%` : "Upload document"}</button>
               <input ref={fileRef} type="file" accept="application/pdf,text/plain,text/markdown,.pdf,.txt,.md" className="hidden" onChange={(e) => void upload(e.target.files?.[0])} />
          </div>
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="mt-8 rounded-2xl border border-dashed border-short/50 bg-short/[0.04] p-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-xl bg-short/10 text-xl text-short"><FiUpload /></span><p className="mt-4 font-medium text-title">Drop a document here or choose a file</p><p className="mt-1 text-sm">PDF, TXT, or Markdown · up to 10 MiB</p>{busy && <div className="mx-auto mt-4 h-2 max-w-sm overflow-hidden rounded-full bg-cardBorder"><div className="h-full rounded-full bg-short transition-all" style={{ width: `${progress}%` }} /></div>}</div>
          {error && <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300"><span>{error}</span><button onClick={() => void refresh(true)} className="font-semibold underline">Reload documents</button></div>}
          {notice && !error && <div role="status" className="mt-5 rounded-xl border border-emerald-600/20 bg-emerald-600/5 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">{notice}</div>}
          <section className="mt-8"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-medium text-title">All documents</h2><span className="text-sm">{loading ? "Loading…" : `${docs.length} ${docs.length === 1 ? "file" : "files"}`}</span></div>
               {loading ? <div className="rounded-2xl border border-cardBorder bg-dashBg p-8 text-center text-sm">Loading your library…</div> : docs.length ? <div className="overflow-hidden rounded-2xl border border-cardBorder bg-dashBg">{docs.map((doc) => <article key={doc.id} className="border-b border-cardBorder p-4 last:border-0 sm:px-5">
                    <div className="flex flex-wrap items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-short/10 text-xl text-short"><FiFileText /></span><div className="min-w-0 flex-1"><h3 className="truncate font-medium text-title">{doc.name}</h3><p className="mt-1 text-sm">{formatSize(doc.size)} · {doc.chunkCount} chunks · {new Date(doc.createdAt).toLocaleDateString()}</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"><FiCheck /> Indexed</span>
                         <button title="Document details" aria-label={`Details for ${doc.name}`} onClick={() => void toggleDetails(doc)} className="grid size-9 place-items-center rounded-lg hover:bg-navB"><FiInfo /></button>
                         {downloadLink?.documentId === doc.id ? <a href={downloadLink.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-short hover:bg-short/10"><FiDownload /> Open download</a> : <button onClick={() => void prepareDownload(doc)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-navB"><FiDownload /> Download</button>}
                         <button disabled={deletingId === doc.id} aria-label={`Delete ${doc.name}`} onClick={() => void remove(doc)} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50">{deletingId === doc.id ? <FiLoader className="animate-spin" /> : <FiTrash2 />}</button>
                    </div>
                    {detailsLoading && detailsForId === doc.id && <p className="ml-14 mt-3 text-xs">Loading details…</p>}
                    {details?.id === doc.id && <div className="ml-14 mt-3 grid gap-1 rounded-lg bg-background p-3 text-xs sm:grid-cols-2"><span>Document ID: {details.id}</span><span>Content type: {details.type}</span><span>Indexed chunks: {details.chunkCount}</span><span>Size: {formatSize(details.size)}</span></div>}
               </article>)}</div> : <div className="rounded-2xl border border-cardBorder bg-dashBg p-10 text-center"><p className="font-medium text-title">Your library is empty</p><p className="mt-1 text-sm">Upload your first PDF, text, or Markdown document to start asking questions.</p></div>}
               {!loading && docs.length > 0 && hasMore && <div className="mt-4 text-center"><button disabled={loadingMore} onClick={() => void loadMore()} className="rounded-lg border border-cardBorder px-4 py-2.5 text-sm font-medium text-title hover:bg-navB disabled:opacity-60">{loadingMore ? "Loading…" : "Load more documents"}</button></div>}
          </section>
          <p className="mt-5 text-xs">Documents are uploaded securely and indexed by your Study Buddy account.</p>
     </div>;
}
