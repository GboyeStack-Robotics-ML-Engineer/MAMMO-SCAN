import { ArrowRight, ShieldCheck, Activity } from "lucide-react";
import Button from "./ui/ButtonOn";
import { SectionId } from "../types";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate()

  return (
    <section
      id={SectionId.HERO}
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent -z-10" />
      <div className="absolute top-40 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Text Content */}
          <div className="lg:w-1/2 flex flex-col items-start text-left animate-fade-in z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              AI for Digital Health & Accessible Care
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-6 tracking-tight">
              Detect Early <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-cyan-500">
                Save Lives
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Empowering radiologists in low-resource settings with a
              transparent, AI-powered assistant. Detect early. Diagnose
              accurately. Save lives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/dashboard')}
                className="shadow-brand-300/50 shadow-lg px-8 py-4 text-lg"
              >
                View the Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => scrollTo(SectionId.PROBLEM)}
                className="px-8 py-4 text-lg"
              >
                Why It Matters
              </Button>
            </div>
          </div>

          {/* Graphic / UI Mockup */}
          <div className="lg:w-1/2 relative w-full perspective-1000">
            {/* Main Interface Card */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up transform transition-transform hover:scale-[1.01] duration-500">
              {/* Fake Browser Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  mammoscan-dashboard.app
                </div>
                <div className="w-4"></div>
              </div>

              {/* Interface Body */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-6">
                  <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                    <Activity size={18} />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/10"></div>
                  <div className="w-8 h-8 rounded-lg bg-white/10"></div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-slate-50 p-6 flex gap-6">
                  {/* Analysis Panel */}
                  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col">
                    <h4 className="font-bold text-slate-900 mb-4">
                      Analysis Results
                    </h4>
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <span className="text-xs font-bold text-red-600 uppercase">
                          Suspicious Mass
                        </span>
                        <p className="text-xs text-slate-600 mt-1">
                          Upper outer quadrant. Shape irregular. BIRADS-4.
                        </p>
                      </div>
                      <div className="h-px bg-slate-100 my-2"></div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500">
                          AI Confidence
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 w-[94%]"></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            94%
                          </span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <button className="w-full py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors">
                          Generate Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 glass-card p-4 rounded-xl shadow-xl animate-float hidden md:block z-20">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Diagnosis Speed
                  </p>
                  <p className="text-xl font-bold text-slate-900">10x Faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
