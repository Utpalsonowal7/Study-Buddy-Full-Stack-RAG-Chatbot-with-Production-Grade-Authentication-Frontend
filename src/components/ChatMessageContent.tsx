import { useState, type ReactNode } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

const tokenPattern = /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b(?:async|await|break|case|catch|class|const|continue|def|del|elif|else|export|extends|false|finally|for|from|function|if|import|in|interface|let|match|new|of|pass|print|private|public|raise|return|self|static|switch|this|throw|try|type|var|while|with|yield|as|and|assert|do|enum|fn|implements|namespace|package|struct|trait|use)\b)|(\b(?:true|false|null|None|True|False|undefined|NaN)\b)|(\b[A-Za-z_$][\w$]*(?=\s*\())/g;

function highlightedCode(source: string) {
     const tokens: ReactNode[] = [];
     let cursor = 0;
     for (const match of source.matchAll(tokenPattern)) {
          const value = match[0];
          const index = match.index ?? 0;
          if (index > cursor) tokens.push(source.slice(cursor, index));
          const color = match[1] ? "text-slate-400 italic" : match[2] ? "text-emerald-300" : match[3] ? "text-orange-300" : match[4] ? "text-violet-300" : match[5] ? "text-sky-300" : "text-amber-200";
          tokens.push(<span key={`${index}-${value}`} className={color}>{value}</span>);
          cursor = index + value.length;
     }
     if (cursor < source.length) tokens.push(source.slice(cursor));
     return tokens;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
     const [copied, setCopied] = useState(false);

     const copy = async () => {
          try {
               await navigator.clipboard.writeText(code);
               setCopied(true);
               window.setTimeout(() => setCopied(false), 1600);
          } catch {
               setCopied(false);
          }
     };

     return <div className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-[#111827] text-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2 text-xs text-slate-300">
               <span className="font-mono">{language || "code"}</span>
               <button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 rounded px-2 py-1 hover:bg-white/10" aria-label="Copy code">
                    {copied ? <FiCheck /> : <FiCopy />}{copied ? "Copied" : "Copy"}
               </button>
          </div>
          <pre className="max-h-[28rem] overflow-auto px-4 py-3 text-[13px] leading-6"><code>{highlightedCode(code)}</code></pre>
     </div>;
}

function inlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
     const pieces = text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g);
     return pieces.map((piece, index) => {
          const key = `${keyPrefix}-${index}`;
          if (piece.startsWith("`") && piece.endsWith("`")) return <code key={key} className="rounded bg-navB px-1.5 py-0.5 font-mono text-[0.9em]">{piece.slice(1, -1)}</code>;
          if (piece.startsWith("**") && piece.endsWith("**")) return <strong key={key} className="font-semibold text-title">{piece.slice(2, -2)}</strong>;
          if (piece.startsWith("*") && piece.endsWith("*")) return <em key={key}>{piece.slice(1, -1)}</em>;
          return piece;
     });
}

export default function ChatMessageContent({ content }: { content: string }) {
     const segments: ReactNode[] = [];
     const fences = /```([^\n`]*)\n?([\s\S]*?)(?:```|$)/g;
     let cursor = 0;
     let part = 0;

     for (const match of content.matchAll(fences)) {
          const index = match.index ?? 0;
          const before = content.slice(cursor, index);
          if (before) segments.push(<p key={`text-${part++}`} className="whitespace-pre-wrap leading-relaxed">{inlineMarkdown(before, `inline-${part}`)}</p>);
          const language = match[1].trim().split(/\s+/)[0] ?? "";
          const code = match[2].replace(/\n$/, "");
          segments.push(<CodeBlock key={`code-${part++}`} code={code} language={language} />);
          cursor = index + match[0].length;
     }

     const remaining = content.slice(cursor);
     if (remaining) segments.push(<p key={`text-${part}`} className="whitespace-pre-wrap leading-relaxed">{inlineMarkdown(remaining, `inline-${part}`)}</p>);
     return <div className="min-w-0">{segments}</div>;
}
