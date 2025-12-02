import Header from "./Header";
import Hero from "./Hero";
import ProblemSolution from "./ProblemSolution";
import StatsCounter from "./StatsCounter";
import InteractiveDemo from "./InteractiveDemo";
import TestimonialsCarousel from "./TestimonialsCarousel";
import Team from "./Team";
import Footer from "./Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      <Header />
      <main>
        <Hero />
        <StatsCounter />
        <ProblemSolution />
        <InteractiveDemo />
        <TestimonialsCarousel />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
