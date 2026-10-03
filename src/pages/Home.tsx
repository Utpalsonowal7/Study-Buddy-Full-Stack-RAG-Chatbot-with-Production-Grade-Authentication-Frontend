import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import { Link } from "react-router";

function Citation({ topic }: { topic: string }) {
     return (
          <div className="mt-2.5 flex items-center gap-2.5 rounded-[10px] border border-cardBorder px-3 py-2 text-sm">
               <span className="rounded-[5px] border border-short/40 bg-short/10 px-1.5 py-1.5 text-[10px] font-bold text-short">
                    PDF
               </span>
               <span>
                    <b className="block font-medium text-dashText">
                         Operating Systems.pdf
                    </b>
                    {topic}
               </span>
          </div>
     );
}

function ChatPreview() {
     return (
          <div
               aria-label="Example conversation"
               className="overflow-hidden rounded-xl border border-cardBorder bg-dashBg shadow-lg shadow-shadow/15"
          >
               <div className="flex items-center gap-1.5 border-b border-cardBorder bg-navB px-3.5 py-2.5">
                    <i className="size-[9px] rounded-full bg-cardBorder" />
                    <i className="size-[9px] rounded-full bg-cardBorder" />
                    <i className="size-[9px] rounded-full bg-cardBorder" />
                    <span className="ml-2 text-[13px]">Operating Systems</span>
               </div>
               <div className="p-5 text-base">
                    <div className="mb-[18px] ml-auto w-fit max-w-[85%] rounded-[10px] bg-short/10 px-3.5 py-2 text-dashText">
                         What is round-robin scheduling?
                    </div>
                    <div className="mb-1 text-sm font-semibold text-short">
                         Study Buddy
                    </div>
                    <div className="leading-normal text-dashText">
                         Each process gets a fixed slice of CPU time, called a{" "}
                         <code className="rounded bg-cardBg px-1.5 py-0.5 font-mono text-sm">
                              time quantum
                         </code>
                         . When it runs out, the process goes to the back of the
                         ready queue.
                    </div>
                    <Citation topic="Page 42 · CPU Scheduling" />
                    <Citation topic="Page 43 · Round Robin" />
               </div>
          </div>
     );
}

const STEPS: { tag: string; title: string; text: string }[] = [
     {
          tag: "Upload",
          title: "Add your material",
          text: "Drop in lecture notes, textbooks or papers. They stay private to your account.",
     },
     {
          tag: "Processing",
          title: "We read it for you",
          text: "Study Buddy extracts the text and indexes it. You'll see when each document is ready.",
     },
     {
          tag: "Ready",
          title: "Ask and verify",
          text: "Every answer links back to the pages it came from, so you can check it against the source.",
     },
];

const FEATURES = [
     {
          title: "Cited answers",
          text: "Each response lists the document, page and topic it used.",
     },
     {
          title: "Choose what it reads",
          text: "Limit a chat to selected documents, such as only your Unit 3 notes.",
     },
     {
          title: "Pick up where you left off",
          text: "Your chats and recent documents are one click away.",
     },
     {
          title: "Secure by default",
          text: "Review your active sessions and sign out of any device, any time.",
     },
];


export default function Home() {
     const { theme, setTheme } = useTheme();

     return (
          <div className="w-full text-muted">
               <nav className="border-b border-cardBorder">
                    <div className="flex items-center gap-5 px-2.5 py-4 lg:px-30">
                         <Link
                              to="/home"
                              className="flex flex-1 items-center gap-2.5 text-lg font-semibold text-title"
                         >
                              <span className="grid size-[26px] place-items-center rounded-[7px] bg-short text-[15px] font-bold text-background">
                                   S
                              </span>
                              Study Buddy
                         </Link>
                         <Link
                              to="/how-it-works"
                              className="hidden hover:text-title sm:block"
                         >
                              How it works
                         </Link>
                         <Link
                              to="/features"
                              className="hidden hover:text-title sm:block"
                         >
                              Features
                         </Link>
                         <button
                              type="button"
                              onClick={() =>
                                   setTheme(theme === "dark" ? "light" : "dark")
                              }
                              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                              className="grid size-9 place-items-center rounded-lg border border-cardBorder text-title transition hover:bg-navB"
                         >
                              {theme === "dark" ? <FiSun /> : <FiMoon />}
                         </button>
                         <a
                              href="#join"
                              className="bg-[#c41e3a] font-bold text-white py-1 px-2 md:py-4 md:px-4 rounded hover:underline"
                         >
                              Sign in
                         </a>
                    </div>
               </nav>

               <header
                    id="top"
                    className="grid items-center gap-10 px-2.5 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-30 lg:py-20"
               >
                    <div>
                         <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-title lg:text-[56px]">
                              Study from your own notes, with the page number to
                              prove it.
                         </h1>
                         <div className="mb-7 mt-6 max-w-[30em] text-xl">
                              Upload your PDFs and ask questions in plain
                              language. Study Buddy answers from your material
                              and shows exactly which pages it used.
                         </div>
                         <div className="flex flex-wrap gap-3">
                              <a href="#join">Get started free</a>
                              <a href="#how">See how it works</a>
                         </div>
                         <div className="mt-4 text-[15px]">
                              Sign in with Google, GitHub or an email code.
                         </div>
                    </div>
                    <ChatPreview />
               </header>

               <section id="how" className="border-t border-cardBorder">
                    <div className="px-2.5 py-16 lg:px-30">
                         <h2>From a pile of PDFs to answers you can check</h2>
                         <div className="mb-9 mt-3 max-w-xl">
                              Three steps, and you can see where each document
                              is at every stage.
                         </div>
                         <div className="grid gap-5 lg:grid-cols-3">
                              {STEPS.map((s) => (
                                   <div
                                        key={s.tag}
                                        className="rounded-xl border border-cardBorder bg-dashBg p-[22px]"
                                   >
                                        <h3 className="mb-1.5 mt-3.5 text-xl font-medium text-title">
                                             {s.title}
                                        </h3>
                                        <div>{s.text}</div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               <section id="features" className="border-t border-cardBorder">
                    <div className="px-2.5 py-16 lg:px-30">
                         <h2>Built for long study sessions</h2>
                         <div className="mb-9 mt-3 max-w-xl">
                              A calm workspace where your documents come first.
                         </div>
                         <div className="grid gap-px overflow-hidden rounded-xl border border-cardBorder bg-cardBorder sm:grid-cols-2">
                              {FEATURES.map((f) => (
                                   <div key={f.title} className="bg-dashBg p-6">
                                        <h3 className="mb-1.5 text-xl font-medium text-title">
                                             {f.title}
                                        </h3>
                                        <div>{f.text}</div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               <section id="join" className="border-t border-cardBorder">
                    <div className="px-2.5 py-16 lg:px-30">
                         <div className="grid gap-8 rounded-xl border border-cardBorder bg-cardBg p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
                              <div>
                                   <h2>
                                        Start studying with your own materials
                                   </h2>
                                   <div className="mt-2.5">
                                        Create an account in under a minute.
                                   </div>
                              </div>
                              <div className="flex min-w-[260px] flex-col gap-2.5">
                                   <button>Start For Free</button>
                              </div>
                         </div>
                    </div>
               </section>

               <footer className="border-t border-cardBorder">
                    <div className="flex flex-wrap justify-between gap-5 px-2.5 pb-9 pt-7 text-[15px] lg:px-30">
                         <span>© 2026 Study Buddy</span>
                         <span>Privacy · Terms · Contact</span>
                    </div>
               </footer>
          </div>
     );
}
