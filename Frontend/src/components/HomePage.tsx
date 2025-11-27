import Header from "./Header";
import Hero from "./Hero";
import ProblemSolution from "./ProblemSolution";
import Features from "./Features";
import Team from "./Team";
import Footer from "./Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      <Header />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
