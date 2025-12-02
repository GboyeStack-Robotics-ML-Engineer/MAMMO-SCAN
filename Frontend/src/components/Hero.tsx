import { ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { ButtonOn as Button } from "./ui/ButtonOn";
import { StreamingText } from "./ui/StreamingText";
import { AnimatedMockup } from "./ui/AnimatedMockup";
import { SectionId } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const [showSubtitle, setShowSubtitle] = useState(false);

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate()

  return (
    <section
      id={SectionId.HERO}
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      {/* Enhanced Dynamic Background with floating particles */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent -z-10" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Text Content */}
          <div className="lg:w-1/2 flex flex-col items-start text-left animate-fade-in z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default animate-glow">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              AI for Digital Health & Accessible Care
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-6 tracking-tight">
              <StreamingText 
                text="Detect Early" 
                speed={80}
                onComplete={() => setShowSubtitle(true)}
              />
              <br />
              {showSubtitle && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-cyan-500 animate-fade-in">
                  <StreamingText text="Save Lives" speed={80} />
                </span>
              )}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Empowering radiologists in low-resource settings with a
              transparent, AI-powered assistant. Detect early. Diagnose
              accurately. Save lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/dashboard')}
                className="shadow-brand-300/50 shadow-lg px-8 py-4 text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                View the Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollTo(SectionId.PROBLEM)}
                className="px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                Why It Matters
              </Button>
            </div>
          </div>

          {/* Animated Graphic / UI Mockup */}
          <div className="lg:w-1/2 relative w-full">
            <AnimatedMockup />
            
            {/* Enhanced Floating Badge with glow */}
            <div className="absolute -top-10 -right-10 glass-card p-4 rounded-xl shadow-2xl animate-float hidden md:block z-20 border border-white/20 backdrop-blur-md bg-white/80">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2.5 rounded-lg text-white shadow-lg animate-pulse">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Diagnosis Speed
                  </p>
                  <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    10x Faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
