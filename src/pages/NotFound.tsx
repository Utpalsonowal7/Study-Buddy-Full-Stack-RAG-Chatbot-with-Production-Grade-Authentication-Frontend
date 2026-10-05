import { Link } from "react-router";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import StudyBuddyLogo from "../components/StudyBuddyLogo";

export default function NotFound() {
     return (
          <main className="grid min-h-screen place-items-center bg-background px-5 py-12 text-muted">
               <section className="w-full max-w-lg text-center">
                    <Link to="/" className="mx-auto block w-fit text-lg">
                         <StudyBuddyLogo size={36} />
                    </Link>
                    <p className="mt-14 text-sm font-semibold uppercase tracking-[0.2em] text-short">404 · Page not found</p>
                    <h1 className="mt-4 text-4xl font-medium tracking-tight text-title sm:text-5xl">We can’t find that page.</h1>
                    <p className="mx-auto mt-4 max-w-md leading-relaxed">The link may be incorrect, or the page may have moved. Head back to your study space and continue from there.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                         <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-cardBorder px-4 py-2.5 font-medium text-title transition hover:bg-navB"><FiArrowLeft /> Go back home</Link>
                         <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-short px-4 py-2.5 font-semibold text-background transition hover:opacity-90"><FiHome /> Dashboard</Link>
                    </div>
               </section>
          </main>
     );
}
