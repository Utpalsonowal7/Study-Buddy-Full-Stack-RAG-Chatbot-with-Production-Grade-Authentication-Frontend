import { Link } from "react-router";
import { FiArrowRight, FiFileText, FiPlus, FiUpload } from "react-icons/fi";

// TODO: replace with real data from your API / auth context
const USER = { name: "Utpal" };

const RECENT = [
     { id: "dbms", title: "DBMS", doc: "DBMS Notes.pdf", last: "2 hours ago" },
     {
          id: "os",
          title: "Operating Systems",
          doc: "Operating Systems.pdf",
          last: "Yesterday",
     },
     {
          id: "cn",
          title: "Computer Networks",
          doc: "CN Notes.pdf",
          last: "3 days ago",
     },
];

const DOC_STATS = [
     {
          label: "Ready",
          count: 8,
          bar: "bg-emerald-600",
          text: "text-emerald-700 dark:text-emerald-400",
     },
     {
          label: "Processing",
          count: 2,
          bar: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-400",
     },
     {
          label: "Failed",
          count: 2,
          bar: "bg-red-500",
          text: "text-red-600 dark:text-red-400",
     },
];

function getGreeting() {
     const hour = new Date().getHours();
     if (hour < 12) return "Good morning";
     if (hour < 18) return "Good afternoon";
     return "Good evening";
}

export default function Dashboard() {
     const total = DOC_STATS.reduce((sum, s) => sum + s.count, 0);

     return (
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
               {/* Greeting */}
               <section className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                         <h1 className="text-3xl font-medium tracking-tight text-title sm:text-4xl">
                              {getGreeting()}, {USER.name}.
                         </h1>
                         <div className="mt-2 text-lg">
                              What would you like to study today?
                         </div>
                    </div>
                    <Link
                         to="/chat"
                         className="flex items-center gap-2 rounded-lg bg-short px-5 py-3 font-semibold text-background transition hover:opacity-90"
                    >
                         <FiPlus /> New conversation
                    </Link>
               </section>

               {/* Continue learning */}
               <section className="mt-12">
                    <h2 className="mb-4 text-xl font-medium text-title">
                         Continue learning
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                         {RECENT.map((c) => (
                              <Link
                                   key={c.id}
                                   to="/chat"
                                   className="group flex flex-col justify-between rounded-2xl border border-cardBorder bg-dashBg p-5 transition hover:border-short/50"
                              >
                                   <div>
                                        <div className="flex items-start justify-between gap-3">
                                             <h3 className="text-lg font-medium text-title">
                                                  {c.title}
                                             </h3>
                                             <FiArrowRight className="mt-1 shrink-0 transition group-hover:translate-x-0.5 group-hover:text-short" />
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-sm">
                                             <FiFileText className="shrink-0" />
                                             <span className="truncate">
                                                  {c.doc}
                                             </span>
                                        </div>
                                   </div>
                                   <div className="mt-6 text-sm">
                                        Last studied {c.last}
                                   </div>
                              </Link>
                         ))}
                    </div>
               </section>

               {/* Documents overview */}
               <section className="mt-12">
                    <h2 className="mb-4 text-xl font-medium text-title">
                         Your documents
                    </h2>
                    <div className="rounded-2xl border border-cardBorder bg-dashBg p-6">
                         <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                   <div className="text-4xl font-medium tracking-tight text-title">
                                        {total}
                                   </div>
                                   <div className="text-sm">
                                        documents in your library
                                   </div>
                              </div>
                              <Link
                                   to="/documents"
                                   className="flex items-center gap-2 rounded-lg border border-cardBorder px-4 py-2.5 text-sm font-semibold text-title transition hover:bg-navB"
                              >
                                   <FiUpload /> Upload document
                              </Link>
                         </div>

                         <div
                              className="mt-6 flex h-2 gap-0.5 overflow-hidden rounded-full bg-cardBorder"
                              role="img"
                              aria-label={DOC_STATS.map(
                                   (s) => `${s.count} ${s.label}`,
                              ).join(", ")}
                         >
                              {DOC_STATS.map((s) => (
                                   <span
                                        key={s.label}
                                        className={s.bar}
                                        style={{
                                             width: `${(s.count / total) * 100}%`,
                                        }}
                                   />
                              ))}
                         </div>

                         <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                              {DOC_STATS.map((s) => (
                                   <div
                                        key={s.label}
                                        className="flex items-center gap-2"
                                   >
                                        <span
                                             className={`size-2 rounded-full ${s.bar}`}
                                        />
                                        <b
                                             className={`font-semibold ${s.text}`}
                                        >
                                             {s.count}
                                        </b>
                                        {s.label.toLowerCase()}
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>
          </div>
     );
}
