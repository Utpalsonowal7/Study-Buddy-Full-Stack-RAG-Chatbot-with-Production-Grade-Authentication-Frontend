import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FiCheck, FiGithub, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

const POINTS = [
     "Every answer cites the exact page it came from",
     "Your documents stay private to your account",
     "Pick up any chat where you left off",
];

const input =
     "w-full rounded-lg border border-cardBorder bg-background px-3.5 py-2.5 text-title outline-none transition placeholder:text-muted/60 focus:border-short focus:ring-2 focus:ring-short/20";

export default function Register() {
     const { theme, setTheme } = useTheme();
     const navigate = useNavigate();

     const [step, setStep] = useState<"details" | "otp">("details");
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [code, setCode] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");
     const [notice, setNotice] = useState("");

  
     const oauth = (provider: "google" | "github") => {
          console.log("continue with", provider);
          window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`;
     };

     const sendCode = async (e: FormEvent) => {
          e.preventDefault();
          if (!name.trim()) return setError("Enter your name.");
          if (!/^\S+@\S+\.\S+$/.test(email))
               return setError("Enter a valid email address.");

          setError("");
          setLoading(true);
          try {
               // await api.post("/auth/register/send-otp", { name, email });
               setStep("otp");
          } catch {
               setError("We couldn't send the code. Try again.");
          } finally {
               setLoading(false);
          }
     };

     const resend = async () => {
          setError("");
          // await api.post("/auth/register/send-otp", { name, email });
          setNotice("A new code is on its way.");
     };

     const verify = async (e: FormEvent) => {
          e.preventDefault();
          if (code.length !== 6) return setError("Enter the 6-digit code.");

          setError("");
          setLoading(true);
          try {
               // await api.post("/auth/register/verify-otp", { email, code });
               navigate("/dashboard");
          } catch {
               setError("That code is incorrect or has expired.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="grid min-h-screen text-muted lg:grid-cols-2">
               {/* Left: pitch */}
               <aside className="hidden flex-col justify-between border-r border-cardBorder bg-cardBg p-12 lg:flex">
                    <Link
                         to="/"
                         className="flex items-center gap-2.5 text-lg font-semibold text-title"
                    >
                         <span className="grid size-7 place-items-center rounded-lg bg-short text-[15px] font-bold text-background">
                              S
                         </span>
                         Study Buddy
                    </Link>

                    <div className="max-w-md">
                         <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-title">
                              Start studying from your own notes.
                         </h2>
                         <ul className="mt-8 space-y-4">
                              {POINTS.map((p) => (
                                   <li key={p} className="flex gap-3 text-lg">
                                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-short/10 text-short">
                                             <FiCheck className="size-3" />
                                        </span>
                                        {p}
                                   </li>
                              ))}
                         </ul>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-cardBorder bg-dashBg px-4 py-3 text-sm shadow-lg shadow-shadow/10">
                         <span className="grid size-6 place-items-center rounded bg-short/10 text-xs font-bold text-short">
                              1
                         </span>
                         <span>
                              <b className="block font-medium text-dashText">
                                   Operating Systems.pdf
                              </b>
                              Page 42 · CPU Scheduling
                         </span>
                    </div>
               </aside>

               {/* Right: form */}
               <main className="flex flex-col px-5 py-6 sm:px-8">
                    <div className="flex items-center justify-between">
                         <Link
                              to="/"
                              className="flex items-center gap-2.5 font-semibold text-title lg:invisible"
                         >
                              <span className="grid size-7 place-items-center rounded-lg bg-short text-[15px] font-bold text-background">
                                   S
                              </span>
                              Study Buddy
                         </Link>
                         <button
                              type="button"
                              onClick={() =>
                                   setTheme(theme === "dark" ? "light" : "dark")
                              }
                              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-cardBorder text-title transition hover:bg-navB"
                         >
                              {theme === "dark" ? <FiSun /> : <FiMoon />}
                         </button>
                    </div>

                    <div className="m-auto w-full max-w-sm py-10">
                         {step === "details" ? (
                              <>
                                   <h1 className="text-3xl font-medium tracking-tight text-title">
                                        Create your account
                                   </h1>
                                   <div className="mb-7 mt-2">
                                        Free to start. No password needed.
                                   </div>

                                   <div className="grid gap-3">
                                        <button
                                             type="button"
                                             onClick={() => oauth("google")}
                                             className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-cardBorder px-4 py-2.5 font-medium text-title transition hover:bg-navB"
                                        >
                                             <FcGoogle className="size-5" />
                                             Continue with Google
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => oauth("github")}
                                             className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-cardBorder px-4 py-2.5 font-medium text-title transition hover:bg-navB"
                                        >
                                             <FiGithub className="size-5" />
                                             Continue with GitHub
                                        </button>
                                   </div>

                                   <div className="my-6 flex items-center gap-3 text-xs">
                                        <span className="h-px flex-1 bg-cardBorder" />
                                        or use your email
                                        <span className="h-px flex-1 bg-cardBorder" />
                                   </div>

                                   <form
                                        onSubmit={sendCode}
                                        className="grid gap-4"
                                        noValidate
                                   >
                                        <label className="grid gap-1.5 text-sm font-medium text-title">
                                             Name
                                             <input
                                                  type="text"
                                                  autoComplete="name"
                                                  value={name}
                                                  onChange={(e) =>
                                                       setName(e.target.value)
                                                  }
                                                  placeholder="Your name"
                                                  className={input}
                                             />
                                        </label>
                                        <label className="grid gap-1.5 text-sm font-medium text-title">
                                             Email
                                             <input
                                                  type="email"
                                                  autoComplete="email"
                                                  value={email}
                                                  onChange={(e) =>
                                                       setEmail(e.target.value)
                                                  }
                                                  placeholder="you@example.com"
                                                  className={input}
                                             />
                                        </label>

                                        {error && (
                                             <div
                                                  role="alert"
                                                  className="text-sm text-red-600 dark:text-red-400"
                                             >
                                                  {error}
                                             </div>
                                        )}

                                        <button
                                             type="submit"
                                             disabled={loading}
                                             className="cursor-pointer rounded-lg bg-short px-4 py-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                             {loading
                                                  ? "Sending code..."
                                                  : "Email me a code"}
                                        </button>
                                   </form>
                              </>
                         ) : (
                              <>
                                   <h1 className="text-3xl font-medium tracking-tight text-title">
                                        Check your email
                                   </h1>
                                   <div className="mb-7 mt-2">
                                        We sent a 6-digit code to{" "}
                                        <b className="font-medium text-title">
                                             {email}
                                        </b>
                                        .
                                   </div>

                                   <form
                                        onSubmit={verify}
                                        className="grid gap-4"
                                        noValidate
                                   >
                                        <label className="grid gap-1.5 text-sm font-medium text-title">
                                             Verification code
                                             <input
                                                  type="text"
                                                  inputMode="numeric"
                                                  autoComplete="one-time-code"
                                                  maxLength={6}
                                                  autoFocus
                                                  value={code}
                                                  onChange={(e) =>
                                                       setCode(
                                                            e.target.value.replace(
                                                                 /\D/g,
                                                                 "",
                                                            ),
                                                       )
                                                  }
                                                  placeholder="000000"
                                                  className={`${input} text-center font-mono text-2xl tracking-[0.5em]`}
                                             />
                                        </label>

                                        {error && (
                                             <div
                                                  role="alert"
                                                  className="text-sm text-red-600 dark:text-red-400"
                                             >
                                                  {error}
                                             </div>
                                        )}
                                        {notice && !error && (
                                             <div className="text-sm text-emerald-700 dark:text-emerald-400">
                                                  {notice}
                                             </div>
                                        )}

                                        <button
                                             type="submit"
                                             disabled={loading}
                                             className="cursor-pointer rounded-lg bg-short px-4 py-3 font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                             {loading
                                                  ? "Verifying..."
                                                  : "Verify and create account"}
                                        </button>
                                   </form>

                                   <div className="mt-5 flex justify-between text-sm">
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  setStep("details");
                                                  setCode("");
                                                  setError("");
                                                  setNotice("");
                                             }}
                                             className="cursor-pointer transition hover:text-title"
                                        >
                                             Use a different email
                                        </button>
                                        <button
                                             type="button"
                                             onClick={resend}
                                             className="cursor-pointer font-medium text-short transition hover:opacity-80"
                                        >
                                             Resend code
                                        </button>
                                   </div>
                              </>
                         )}

                         <div className="mt-8 text-center text-sm">
                              Already have an account?{" "}
                              <Link
                                   to="/login"
                                   className="font-medium text-short hover:underline"
                              >
                                   Sign in
                              </Link>
                         </div>
                         <div className="mt-4 text-center text-xs">
                              By continuing you agree to the Terms and Privacy
                              Policy.
                         </div>
                    </div>
               </main>
          </div>
     );
}
