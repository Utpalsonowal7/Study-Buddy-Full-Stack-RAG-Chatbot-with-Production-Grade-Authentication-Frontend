import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiBookOpen, FiGithub } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/auth";
import { backendUrl } from "../api/api";

const input =
     "w-full rounded-lg border border-cardBorder bg-background px-3.5 py-2.5 text-title outline-none transition placeholder:text-muted/60 focus:border-short focus:ring-2 focus:ring-short/20";

export default function Login() {
     const { requestLoginCode, login } = useAuth();
     const navigate = useNavigate();
     const [step, setStep] = useState<"email" | "otp">("email");
     const [email, setEmail] = useState("");
     const [otp, setOtp] = useState("");
     const [error, setError] = useState("");
     const [notice, setNotice] = useState("");
     const [loading, setLoading] = useState(false);

     const startSocialLogin = (provider: "google" | "github") => {
          if (!backendUrl) {
               setError("Set VITE_BACKEND_URL to use social sign-in.");
               return;
          }
          window.location.assign(`${backendUrl}/auth/${provider}`);
     };

     const sendCode = async (event: FormEvent) => {
          event.preventDefault();
          setError("");
          setNotice("");
          setLoading(true);
          try {
               await requestLoginCode(email);
               setStep("otp");
               setNotice("Check your inbox for the sign-in code.");
          } catch (e) {
               setError(
                    getApiErrorMessage(e, "We couldn't send a sign-in code."),
               );
          } finally {
               setLoading(false);
          }
     };
     const verifyCode = async (event: FormEvent) => {
          event.preventDefault();
          setError("");
          setLoading(true);
          try {
               await login(email, otp);
               navigate("/dashboard", { replace: true });
          } catch (e) {
               setError(
                    getApiErrorMessage(e, "That code could not be verified."),
               );
          } finally {
               setLoading(false);
          }
     };
     const resend = async () => {
          setError("");
          setNotice("");
          setLoading(true);
          try {
               await requestLoginCode(email);
               setNotice("A new code was requested. Check your inbox.");
          } catch (e) {
               setError(getApiErrorMessage(e, "We couldn't resend the code."));
          } finally {
               setLoading(false);
          }
     };

     return (
          <main className="grid min-h-screen text-muted lg:grid-cols-2">
               <aside className="hidden flex-col justify-between border-r border-cardBorder bg-cardBg p-12 lg:flex">
                    <Link
                         to="/"
                         className="flex items-center gap-2.5 text-lg font-semibold text-title"
                    >
                         <span className="grid size-7 place-items-center rounded-lg bg-short text-background">
                              S
                         </span>
                         Study Buddy
                    </Link>
                    <div className="max-w-md">
                         <span className="grid size-12 place-items-center rounded-xl bg-short/10 text-2xl text-short">
                              <FiBookOpen />
                         </span>
                         <h1 className="mt-6 text-4xl font-medium leading-tight tracking-tight text-title">
                              Your notes are ready when you are.
                         </h1>
                         <p className="mt-4 text-lg leading-relaxed">
                              Pick up a conversation, explore your library, and
                              keep your study sessions moving.
                         </p>
                    </div>
                    <p className="text-sm">A quieter way to make progress.</p>
               </aside>
               <section className="flex flex-col px-5 py-6 sm:px-8">
                    <Link
                         to="/"
                         className="flex items-center gap-2 font-semibold text-title lg:invisible"
                    >
                         <span className="grid size-7 place-items-center rounded-lg bg-short text-background">
                              S
                         </span>
                         Study Buddy
                    </Link>
                    <div className="m-auto w-full max-w-sm py-12">
                         {step === "email" ? (
                              <>
                                   <h1 className="text-3xl font-medium tracking-tight text-title">
                                        Welcome back
                                   </h1>
                                   <p className="mb-7 mt-2">
                                        Enter your email and we’ll send you a
                                        sign-in code.
                                   </p>
                                   <div className="grid gap-3">
                                        <button
                                             type="button"
                                             onClick={() => startSocialLogin("google")}
                                             className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-cardBorder px-4 py-2.5 font-medium text-title transition hover:bg-navB"
                                        >
                                             <FcGoogle className="size-5" />
                                             Continue with Google
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => startSocialLogin("github")}
                                             className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-cardBorder px-4 py-2.5 font-medium text-title transition hover:bg-navB"
                                        >
                                             <FiGithub className="size-5" />
                                             Continue with GitHub
                                        </button>
                                   </div>
                                   <div className="my-6 flex items-center gap-3 text-xs">
                                        <span className="h-px flex-1 bg-cardBorder" />
                                        or sign in with email
                                        <span className="h-px flex-1 bg-cardBorder" />
                                   </div>
                                   <form
                                        onSubmit={(e) => void sendCode(e)}
                                        className="grid gap-4"
                                   >
                                        <label className="grid gap-1.5 text-sm font-medium text-title">
                                             Email
                                             <input
                                                  className={input}
                                                  type="email"
                                                  autoComplete="email"
                                                  required
                                                  value={email}
                                                  onChange={(e) =>
                                                       setEmail(e.target.value)
                                                  }
                                                  placeholder="you@example.com"
                                             />
                                        </label>
                                        {error && (
                                             <p
                                                  role="alert"
                                                  className="text-sm text-red-600 dark:text-red-400"
                                             >
                                                  {error}
                                             </p>
                                        )}
                                        <button
                                             disabled={loading}
                                             className="flex items-center justify-center gap-2 rounded-lg bg-short px-4 py-3 font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
                                        >
                                             {loading
                                                  ? "Sending code…"
                                                  : "Email me a code"}
                                             <FiArrowRight />
                                        </button>
                                   </form>
                                   <p className="mt-7 text-center text-sm">
                                        New to Study Buddy?{" "}
                                        <Link
                                             to="/register"
                                             className="font-medium text-short hover:underline"
                                        >
                                             Create an account
                                        </Link>
                                   </p>
                              </>
                         ) : (
                              <>
                                   <h1 className="text-3xl font-medium tracking-tight text-title">
                                        Check your email
                                   </h1>
                                   <p className="mb-7 mt-2">
                                        Enter the sign-in code sent to{" "}
                                        <b className="font-medium text-title">
                                             {email}
                                        </b>
                                        .
                                   </p>
                                   <form
                                        onSubmit={(e) => void verifyCode(e)}
                                        className="grid gap-4"
                                   >
                                        <label className="grid gap-1.5 text-sm font-medium text-title">
                                             Verification code
                                             <input
                                                  className={`${input} text-center font-mono text-2xl tracking-[0.5em]`}
                                                  type="text"
                                                  inputMode="numeric"
                                                  autoComplete="one-time-code"
                                                  maxLength={6}
                                                  minLength={6}
                                                  pattern="[0-9]{6}"
                                                  required
                                                  value={otp}
                                                  onChange={(e) =>
                                                       setOtp(
                                                            e.target.value.replace(
                                                                 /\D/g,
                                                                 "",
                                                            ),
                                                       )
                                                  }
                                                  placeholder="000000"
                                             />
                                        </label>
                                        {error && (
                                             <p
                                                  role="alert"
                                                  className="text-sm text-red-600 dark:text-red-400"
                                             >
                                                  {error}
                                             </p>
                                        )}
                                        {notice && !error && (
                                             <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                                  {notice}
                                             </p>
                                        )}
                                        <button
                                             disabled={loading}
                                             className="rounded-lg bg-short px-4 py-3 font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
                                        >
                                             {loading
                                                  ? "Verifying…"
                                                  : "Verify and sign in"}
                                        </button>
                                   </form>
                                   <div className="mt-5 flex justify-between text-sm">
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  setStep("email");
                                                  setOtp("");
                                                  setError("");
                                                  setNotice("");
                                             }}
                                             className="hover:text-title"
                                        >
                                             Use a different email
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => void resend()}
                                             disabled={loading}
                                             className="font-medium text-short hover:opacity-80"
                                        >
                                             Resend code
                                        </button>
                                   </div>
                              </>
                         )}
                    </div>
               </section>
          </main>
     );
}
