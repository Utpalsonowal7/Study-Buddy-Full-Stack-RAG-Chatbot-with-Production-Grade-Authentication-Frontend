import { useState } from "react";
import { useNavigate } from "react-router";
import { FiLogOut, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function Settings() {
     const { user, logout } = useAuth(); const { theme, setTheme } = useTheme(); const navigate = useNavigate(); const [confirm, setConfirm] = useState(false);
     const signOut = async () => { await logout(); navigate("/", { replace: true }); };
     return <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8"><p className="text-sm font-medium uppercase tracking-[0.16em] text-short">Workspace</p><h1 className="mt-2 text-3xl font-medium tracking-tight text-title">Settings</h1><p className="mt-2">Manage your account and study space preferences.</p>
          <section className="mt-8 overflow-hidden rounded-2xl border border-cardBorder bg-dashBg"><div className="flex items-center gap-4 border-b border-cardBorder p-5"><span className="grid size-11 place-items-center rounded-full bg-short/10 text-xl text-short"><FiUser /></span><div><h2 className="font-medium text-title">{user?.name}</h2><p className="text-sm">{user?.email}</p></div></div><div className="flex items-center justify-between gap-4 p-5"><div><h3 className="font-medium text-title">Appearance</h3><p className="mt-1 text-sm">Choose the theme for this browser.</p></div><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center gap-2 rounded-lg border border-cardBorder px-3 py-2 text-sm font-medium text-title hover:bg-navB">{theme === "dark" ? <FiSun /> : <FiMoon />}{theme === "dark" ? "Light mode" : "Dark mode"}</button></div><div className="flex flex-wrap items-center justify-between gap-4 border-t border-cardBorder p-5"><div><h3 className="font-medium text-title">Demo session</h3><p className="mt-1 text-sm">Sign out of this browser session.</p></div>{confirm ? <div className="flex gap-2"><button onClick={() => setConfirm(false)} className="rounded-lg border border-cardBorder px-3 py-2 text-sm">Cancel</button><button onClick={() => void signOut()} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white">Confirm sign out</button></div> : <button onClick={() => setConfirm(true)} className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10"><FiLogOut /> Sign out</button>}</div></section>
          <p className="mt-5 text-xs">Your session uses secure backend cookies. Study documents and conversations are loaded from your account.</p>
     </div>;
}
