import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
     FiFileText,
     FiHome,
     FiMenu,
     FiMessageSquare,
     FiMoon,
     FiPlus,
     FiSearch,
     FiSettings,
     FiSun,
} from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

// TODO: replace with real data from your API / auth context
const USER = { name: "Utpal" };
const RECENT_CHATS = ["DBMS", "Operating Systems", "Computer Networks"];
const LIBRARY = ["DBMS.pdf", "OS.pdf", "CN Notes.pdf"];

const navClass = ({ isActive }: { isActive: boolean }) =>
     `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
          isActive
               ? "bg-dashBg font-medium text-title ring-1 ring-cardBorder"
               : "hover:bg-navB hover:text-title"
     }`;

export default function AppLayout() {
     const { theme, setTheme } = useTheme();
     const [open, setOpen] = useState(false);
     const close = () => setOpen(false);

     return (
          <div className="flex h-screen bg-background text-muted">
               {open && (
                    <div
                         className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                         onClick={close}
                    />
               )}

               {/* Sidebar */}
               <aside
                    className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-cardBorder bg-cardBg transition-transform lg:static lg:translate-x-0 ${
                         open ? "translate-x-0" : "-translate-x-full"
                    }`}
               >
                    <Link
                         to="/"
                         onClick={close}
                         className="flex items-center gap-2.5 px-5 py-4 text-lg font-semibold text-title"
                    >
                         <span className="grid size-7 place-items-center rounded-lg bg-short text-[15px] font-bold text-background">
                              S
                         </span>
                         Study Buddy
                    </Link>

                    <div className="px-3">
                         <Link
                              to="/chat"
                              onClick={close}
                              className="flex items-center justify-center gap-2 rounded-lg bg-short px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
                         >
                              <FiPlus /> New chat
                         </Link>
                    </div>

                    <nav
                         aria-label="Sidebar"
                         className="mt-5 flex-1 space-y-6 overflow-y-auto px-3 pb-4"
                    >
                         <div className="space-y-0.5">
                              <div className="px-3 pb-1 text-xs font-medium">
                                   Workspace
                              </div>
                              <NavLink
                                   to="/dashboard"
                                   onClick={close}
                                   className={navClass}
                              >
                                   <FiHome /> Dashboard
                              </NavLink>
                              <NavLink
                                   to="/chat"
                                   onClick={close}
                                   className={navClass}
                              >
                                   <FiMessageSquare /> Chats
                              </NavLink>
                              <NavLink
                                   to="/documents"
                                   onClick={close}
                                   className={navClass}
                              >
                                   <FiFileText /> Documents
                              </NavLink>
                         </div>

                         <div className="space-y-0.5">
                              <div className="px-3 pb-1 text-xs font-medium">
                                   Recent chats
                              </div>
                              {RECENT_CHATS.map((c) => (
                                   <Link
                                        key={c}
                                        to="/chat"
                                        onClick={close}
                                        className="block truncate rounded-lg px-3 py-1.5 text-sm transition hover:bg-navB hover:text-title"
                                   >
                                        {c}
                                   </Link>
                              ))}
                         </div>

                         <div className="space-y-0.5">
                              <div className="px-3 pb-1 text-xs font-medium">
                                   Library
                              </div>
                              {LIBRARY.map((d) => (
                                   <Link
                                        key={d}
                                        to="/documents"
                                        onClick={close}
                                        className="flex items-center gap-2 truncate rounded-lg px-3 py-1.5 text-sm transition hover:bg-navB hover:text-title"
                                   >
                                        <FiFileText className="shrink-0" />
                                        <span className="truncate">{d}</span>
                                   </Link>
                              ))}
                         </div>
                    </nav>

                    <div className="border-t border-cardBorder p-3">
                         <NavLink
                              to="/settings"
                              onClick={close}
                              className={navClass}
                         >
                              <FiSettings /> Settings
                         </NavLink>
                    </div>
               </aside>

               {/* Main */}
               <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-cardBorder px-4 sm:px-6">
                         <button
                              type="button"
                              onClick={() => setOpen(true)}
                              aria-label="Open menu"
                              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-cardBorder text-title transition hover:bg-navB lg:hidden"
                         >
                              <FiMenu />
                         </button>

                         <label className="relative flex-1 sm:max-w-md">
                              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                   type="search"
                                   placeholder="Search chats and documents..."
                                   className="w-full rounded-lg border border-cardBorder bg-dashBg py-2 pl-9 pr-3 text-sm text-title outline-none transition placeholder:text-muted/70 focus:border-short focus:ring-2 focus:ring-short/20"
                              />
                         </label>

                         <div className="ml-auto flex items-center gap-3">
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
                              <span
                                   title={USER.name}
                                   className="grid size-9 place-items-center rounded-full bg-short/10 text-sm font-semibold text-short"
                              >
                                   {USER.name[0]}
                              </span>
                         </div>
                    </header>

                    <main className="flex-1 overflow-y-auto">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
}
