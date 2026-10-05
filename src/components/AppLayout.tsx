import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
     FiFileText,
     FiHome,
     FiMenu,
     FiMessageSquare,
     FiMoon,
     FiPlus,
     FiSettings,
     FiSun,
} from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { getStudyData, STUDY_DATA_INVALIDATED } from "../services/rag";
import { getApiErrorMessage } from "../services/auth";
import type { StudyData } from "../types/study";
import StudyBuddyLogo from "./StudyBuddyLogo";

const navClass = ({ isActive }: { isActive: boolean }) =>
     `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
          isActive
               ? "bg-dashBg font-medium text-title ring-1 ring-cardBorder"
               : "hover:bg-navB hover:text-title"
     }`;

export default function AppLayout() {
     const { theme, setTheme } = useTheme();
     const { user, logout } = useAuth();
     const navigate = useNavigate();
     const [open, setOpen] = useState(false);
     const [data, setData] = useState<StudyData | null>(null);
     const [dataError, setDataError] = useState("");
     const loadWorkspace = useCallback(async (force = false) => {
          try { setData(await getStudyData(force)); setDataError(""); }
          catch (error) { setDataError(getApiErrorMessage(error, "Workspace shortcuts could not be loaded.")); }
     }, []);
     useEffect(() => {
          let mounted = true;
          void getStudyData().then((workspace) => {
               if (mounted) { setData(workspace); setDataError(""); }
          }).catch((error: unknown) => {
               if (mounted) setDataError(getApiErrorMessage(error, "Workspace shortcuts could not be loaded."));
          });
          const refresh = () => { void loadWorkspace(true); };
          window.addEventListener(STUDY_DATA_INVALIDATED, refresh);
          return () => { mounted = false; window.removeEventListener(STUDY_DATA_INVALIDATED, refresh); };
     }, [loadWorkspace]);
     const close = () => setOpen(false);
     const signOut = async () => { await logout(); navigate("/", { replace: true }); };

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
                    <Link to="/dashboard" onClick={close} className="px-5 py-4 text-lg">
                         <StudyBuddyLogo size={30} />
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
                              {(data?.chats ?? []).slice(0, 4).map((c) => (
                                   <Link
                                        key={c.id}
                                        to={`/chat/${c.id}`}
                                        onClick={close}
                                        className="block truncate rounded-lg px-3 py-1.5 text-sm transition hover:bg-navB hover:text-title"
                                   >
                                        {c.title}
                                   </Link>
                              ))}
                              {dataError && <button onClick={() => void loadWorkspace(true)} className="px-3 py-1.5 text-left text-xs text-red-700 underline dark:text-red-300">Couldn't load recent chats. Retry</button>}
                         </div>

                         <div className="space-y-0.5">
                              <div className="px-3 pb-1 text-xs font-medium">
                                   Library
                              </div>
                              {(data?.documents ?? []).slice(0, 4).map((d) => (
                                   <Link
                                        key={d.id}
                                        to="/documents"
                                        onClick={close}
                                        className="flex items-center gap-2 truncate rounded-lg px-3 py-1.5 text-sm transition hover:bg-navB hover:text-title"
                                   >
                                        <FiFileText className="shrink-0" />
                                        <span className="truncate">{d.name}</span>
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

                         <Link to="/dashboard" className="text-sm font-medium text-title">Study workspace</Link>

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
                                   title={user?.name ?? "Account"}
                                   className="grid size-9 place-items-center rounded-full bg-short/10 text-sm font-semibold text-short"
                              >
                                   {(user?.name ?? "S")[0].toUpperCase()}
                              </span>
                              <button type="button" onClick={() => void signOut()} className="hidden rounded-lg px-2 py-1.5 text-sm hover:bg-navB sm:block">Sign out</button>
                         </div>
                    </header>

                    <main className="flex-1 overflow-y-auto">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
}
