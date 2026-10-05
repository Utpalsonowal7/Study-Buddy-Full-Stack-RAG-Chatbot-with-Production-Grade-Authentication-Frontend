import {
     FiArrowUp,
     FiClock,
     FiFileText,
     FiFilter,
     FiMoon,
     FiShield,
     FiSun,
} from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import StudyBuddyLogo, { StudyBuddyMark } from "../components/StudyBuddyLogo";

function Source({ n, topic }: { n: number; topic: string }) {
     return (
          <div className="flex items-center gap-3 rounded-lg border border-cardBorder bg-background px-3 py-2 text-sm">
               <span className="grid size-5 shrink-0 place-items-center rounded bg-short/10 text-[11px] font-bold text-short">
                    {n}
               </span>
               <span className="min-w-0">
                    <b className="block truncate font-medium text-dashText">
                         Operating Systems.pdf
                    </b>
                    <span className="text-xs">{topic}</span>
               </span>
          </div>
     );
}

function ChatPreview() {
     return (
          <div className="[perspective:1400px] [perspective-origin:50%_40%] py-6">
               <div
                    aria-label="Example conversation"
                    className="
                         group relative
                         [transform-style:preserve-3d]
                         [transform:rotateX(14deg)_rotateY(-22deg)_rotateZ(4deg)]
                         transition-transform duration-700 ease-out
                         hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)]
                    "
               >
                    
                    <div
                         className="
                              absolute inset-0 rounded-2xl border border-cardBorder bg-cardBg/40
                              shadow-xl shadow-shadow/10
                              [transform:translate3d(28px,28px,-90px)]
                              transition-transform duration-700
                              group-hover:[transform:translate3d(10px,10px,-20px)]
                         "
                    />

                  
                    <div
                         className="
                              absolute inset-0 rounded-2xl border border-cardBorder bg-cardBg/70
                              shadow-xl shadow-shadow/10
                              [transform:translate3d(14px,14px,-45px)]
                              transition-transform duration-700
                              group-hover:[transform:translate3d(5px,5px,-10px)]
                         "
                    />

                  
                    <div
                         className="
                              relative overflow-hidden rounded-2xl border border-cardBorder
                              bg-dashBg shadow-2xl shadow-shadow/20
                         "
                    >
                         <div className="flex items-center gap-1.5 border-b border-cardBorder bg-navB px-4 py-3">
                              <i className="size-2.5 rounded-full bg-amber-600" />
                              <i className="size-2.5 rounded-full bg-amber-200" />
                              <i className="size-2.5 rounded-full bg-emerald-500" />
                              <span className="ml-2 text-[13px]">
                                   Operating Systems
                              </span>
                         </div>

                         <div className="space-y-5 p-5">
                              <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-short/10 px-4 py-2.5 text-dashText">
                                   What is round-robin scheduling?
                              </div>

                              <div>
                                   <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-title">
                                        <StudyBuddyMark size={24} />
                                        Study Buddy
                                   </div>
                                   <div className="leading-relaxed text-dashText">
                                        Each process gets a fixed slice of CPU
                                        time, called a{" "}
                                        <code className="rounded bg-cardBg px-1.5 py-0.5 font-mono text-sm">
                                             time quantum
                                        </code>
                                        .
                                        <sup className="ml-0.5 font-semibold text-short">
                                             1
                                        </sup>{" "}
                                        When it runs out, the process goes to
                                        the back of the ready queue.
                                        <sup className="ml-0.5 font-semibold text-short">
                                             2
                                        </sup>
                                   </div>
                              </div>

                              <div className="space-y-2">
                                   <Source
                                        n={1}
                                        topic="Page 42 · CPU Scheduling"
                                   />
                                   <Source
                                        n={2}
                                        topic="Page 43 · Round Robin"
                                   />
                              </div>

                              <div className="flex items-center justify-between rounded-xl border border-cardBorder bg-background py-2 pl-4 pr-2 text-sm">
                                   Ask about your study material...
                                   <span className="grid size-7 place-items-center rounded-lg bg-short text-background">
                                        <FiArrowUp />
                                   </span>
                              </div>
                         </div>
                    </div>

                    <div
                         className="
                              absolute -right-4 top-24 hidden sm:flex items-center gap-2
                              rounded-lg border border-cardBorder bg-background px-3 py-2
                              text-xs font-semibold text-short shadow-xl shadow-shadow/30
                              [transform:translateZ(70px)]
                              transition-transform duration-700
                              group-hover:[transform:translateZ(0px)]
                         "
                    >
                         <FiFileText /> Page 42 verified
                    </div>
               </div>
          </div>
     );
}

const STEPS = [
     {
          tag: "Upload",
          pill: "bg-short/10 text-short",
          title: "Add your material",
          text: "Drop in lecture notes, textbooks or papers. They stay private to your account.",
     },
     {
          tag: "Processing",
          pill: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
          title: "We read it for you",
          text: "Study Buddy extracts the text and indexes it. You'll see when each document is ready.",
     },
     {
          tag: "Ready",
          pill: "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400",
          title: "Ask and verify",
          text: "Every answer links back to the pages it came from, so you can check it against the source.",
     },
];

const FEATURES = [
     {
          icon: FiFileText,
          title: "Cited answers",
          text: "Each response lists the document, page and topic it used.",
     },
     {
          icon: FiFilter,
          title: "Choose what it reads",
          text: "Limit a chat to selected documents, such as only your Unit 3 notes.",
     },
     {
          icon: FiClock,
          title: "Pick up where you left off",
          text: "Your chats and recent documents are one click away.",
     },
     {
          icon: FiShield,
          title: "Secure by default",
          text: "Review your active sessions and sign out of any device, any time.",
     },
];

export default function Home() {
     const { theme, setTheme } = useTheme();
     const { user, loading } = useAuth();

     if (!loading && user) {
          return <Navigate to="/dashboard" replace />;
     }

     return (
          <div className="w-full text-muted">
               {/* Nav */}
               <nav className="sticky top-0 z-10 border-b border-cardBorder bg-background/85 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
                         <Link to="/" className="text-lg">
                              <StudyBuddyLogo size={32} />
                         </Link>
                         <div className="flex items-center gap-6">
                              <a
                                   href="#how"
                                   className="hidden text-[15px] transition hover:text-title sm:block"
                              >
                                   How it works
                              </a>
                              <a
                                   href="#features"
                                   className="hidden text-[15px] transition hover:text-title sm:block"
                              >
                                   Features
                              </a>
                              <button
                                   type="button"
                                   onClick={() =>
                                        setTheme(
                                             theme === "dark"
                                                  ? "light"
                                                  : "dark",
                                        )
                                   }
                                   aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                                   className="grid size-9 cursor-pointer place-items-center rounded-lg border border-cardBorder text-title transition hover:bg-navB"
                              >
                                   {theme === "dark" ? <FiSun /> : <FiMoon />}
                              </button>
                              <Link
                                   to="/login"
                                   className="rounded-lg bg-short px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
                              >
                                   Sign in
                              </Link>
                         </div>
                    </div>
               </nav>

               {/* Hero */}
               <header id="top">
                    <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
                         <div>
                              <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-title sm:text-5xl lg:text-[56px]">
                                   Study from your own notes, with the page
                                   number to prove it.
                              </h1>
                              <div className="mb-8 mt-6 max-w-[30em] text-lg leading-relaxed">
                                   Upload your PDFs and ask questions in plain
                                   language. Study Buddy answers from your
                                   material and shows exactly which pages it
                                   used.
                              </div>
                              <div className="flex  gap-3">
                                   <Link
                                        to="/register"
                                        className="rounded-lg bg-short px-2 py-2 md:px-5 md:py-3 font-semibold text-background transition hover:opacity-90"
                                   >
                                        Get started free
                                   </Link>
                                   <a
                                        href="#how"
                                        className="rounded-lg border border-cardBorder px-2 py-2 md:px-5 md:py-3 font-semibold text-title transition hover:bg-navB"
                                   >
                                        See how it works
                                   </a>
                              </div>
                          
                         </div>
                         <ChatPreview />
                    </div>
               </header>

               {/* How it works */}
               <section
                    id="how"
                    className="scroll-mt-16 border-t border-cardBorder"
               >
                    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
                         <div className="mb-10 max-w-2xl">
                              <h2 className="text-3xl font-medium tracking-tight text-title sm:text-4xl">
                                   From a pile of PDFs to answers you can check
                              </h2>
                              <div className="mt-3 text-lg">
                                   Three steps, and you can see where each
                                   document is at every stage.
                              </div>
                         </div>
                         <div className="grid gap-5 lg:grid-cols-3">
                              {STEPS.map((s) => (
                                   <div
                                        key={s.tag}
                                        className="rounded-2xl border border-cardBorder bg-dashBg p-6 transition hover:border-short/40"
                                   >
                                        <span
                                             className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[13px] font-medium before:size-[7px] before:rounded-full before:bg-current ${s.pill}`}
                                        >
                                             {s.tag}
                                        </span>
                                        <h3 className="mb-2 mt-4 text-xl font-medium text-title">
                                             {s.title}
                                        </h3>
                                        <div className="leading-relaxed">
                                             {s.text}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Features */}
               <section
                    id="features"
                    className="scroll-mt-16 border-t border-cardBorder"
               >
                    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
                         <div className="mb-10 max-w-2xl">
                              <h2 className="text-3xl font-medium tracking-tight text-title sm:text-4xl">
                                   Built for long study sessions
                              </h2>
                              <div className="mt-3 text-lg">
                                   A calm workspace where your documents come
                                   first.
                              </div>
                         </div>
                         <div className="grid gap-px overflow-hidden rounded-2xl border border-cardBorder bg-cardBorder sm:grid-cols-2">
                              {FEATURES.map((f) => (
                                   <div key={f.title} className="bg-dashBg p-7">
                                        <span className="grid size-10 place-items-center rounded-lg bg-short/10 text-lg text-short">
                                             <f.icon />
                                        </span>
                                        <h3 className="mb-1.5 mt-4 text-xl font-medium text-title">
                                             {f.title}
                                        </h3>
                                        <div className="leading-relaxed">
                                             {f.text}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Sign up */}
               <section
                    id="join"
                    className="scroll-mt-16 border-t border-cardBorder"
               >
                    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
                         <div className="grid gap-8 rounded-2xl border border-cardBorder bg-cardBg p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
                              <div>
                                   <h2 className="max-w-[18em] text-3xl font-medium tracking-tight text-title sm:text-4xl">
                                        Start studying with your own materials
                                   </h2>
                                   <div className="mt-3 text-lg">
                                        Create an account in under a minute.
                                   </div>
                              </div>
                              <Link
                                   to="/register"
                                   className="rounded-lg bg-short px-7 py-3.5 text-center font-semibold text-background transition hover:opacity-90"
                              >
                                   Start for free
                              </Link>
                         </div>
                    </div>
               </section>

               {/* Footer */}
               <footer className="border-t border-cardBorder">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm sm:px-8">
                         <span className="flex items-center gap-2">
                              <StudyBuddyMark size={22} />© 2026 Study Buddy
                         </span>
                         <span className="flex gap-5">
                              <a
                                   href="#"
                                   className="transition hover:text-title"
                              >
                                   Privacy
                              </a>
                              <a
                                   href="#"
                                   className="transition hover:text-title"
                              >
                                   Terms
                              </a>
                              <a
                                   href="#"
                                   className="transition hover:text-title"
                              >
                                   Contact
                              </a>
                         </span>
                    </div>
               </footer>
          </div>
     );
}
