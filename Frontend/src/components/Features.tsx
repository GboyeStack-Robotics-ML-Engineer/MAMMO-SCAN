import { Brain, Zap, Lock, Microscope, Users, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { SectionId } from '../types';

export default function Features() {
  return (
    <section id={SectionId.FEATURES} className="py-24 bg-slate-50 relative overflow-hidden">
       {/* Decorative blobs */}
       <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Under The Hood</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We combine state-of-the-art deep learning with edge computing to deliver a robust, clinic-ready solution.
            </p>
          </div>
          <div className="hidden md:block">
             <button className="group flex items-center gap-2 text-slate-900 font-bold hover:text-brand-600 transition-colors">
                Read Technical Whitepaper 
                <span className="bg-slate-200 group-hover:bg-brand-100 p-1 rounded-full transition-colors">
                  <ArrowRight size={16} />
                </span>
             </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 grid-rows-[auto_auto_auto]">
          
          {/* Main Feature - The Brain */}
          <div className="md:col-span-4 row-span-2 bg-white rounded-4xl p-8 md:p-10 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-br from-brand-50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-105 transition-transform duration-700"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform">
                  <Brain size={28} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Hybrid Intelligence Core</h3>
                <p className="text-slate-600 leading-relaxed text-lg max-w-xl">
                   Most AI systems just classify. Ours converses. We run a specialized CNN for feature extraction and pipe the results into a fine-tuned LLM. This allows us to generate reports that look like they were written by a human specialist.
                </p>
              </div>
              
              {/* Fake Terminal UI */}
              <div className="mt-12 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center gap-2 px-4">
                   <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                   <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                   <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="mt-4 font-mono text-xs md:text-sm space-y-2">
                   <div className="flex gap-3 text-slate-400">
                      <span className="text-brand-500">$</span>
                      <span>./mammo-core --analyze scan_0492.dcm</span>
                   </div>
                   <div className="flex gap-3 text-cyan-400">
                      <span className="text-slate-600">output:</span>
                      <span>Processing tissue density... [Done]</span>
                   </div>
                   <div className="flex gap-3 text-cyan-400">
                      <span className="text-slate-600">output:</span>
                      <span>Identified 2 calcification clusters.</span>
                   </div>
                   <div className="flex gap-3 text-emerald-400">
                      <span className="text-slate-600">llm:</span>
                      <span className="typing-effect">"Findings consistent with early-stage ductal carcinoma..."</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Offline Ready */}
          <div className="md:col-span-2 bg-slate-900 text-white rounded-4xl p-8 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between min-h-[280px]">
               <div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4 border border-white/20">
                     <WifiOff size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Internet? No Problem.</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                     Built for remote clinics. The core inference engine runs locally on standard hardware.
                  </p>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  SYSTEM ONLINE
               </div>
            </div>
            {/* Background Graphic */}
            <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
               <Wifi size={140} />
            </div>
          </div>

          {/* Feature: Speed */}
          <div className="md:col-span-2 bg-white rounded-4xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
               <Zap size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Triage</h3>
             <p className="text-slate-600 text-sm leading-relaxed">
                Analysis completes in &lt;60 seconds. Patients get initial results before they leave the clinic.
             </p>
          </div>

          {/* Feature: Education */}
          <div className="md:col-span-2 bg-linear-to-br from-brand-600 to-brand-700 text-white rounded-4xl p-8 shadow-lg relative group overflow-hidden">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Upskilling Tool</h3>
                <p className="text-brand-100 text-sm leading-relaxed">
                   Junior doctors learn from the AI's explanations, effectively training the next generation of specialists.
                </p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {/* Feature: Privacy */}
          <div className="md:col-span-2 bg-white rounded-4xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4">
               <Lock size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Patient Privacy</h3>
             <p className="text-slate-600 text-sm leading-relaxed">
                All data is anonymized locally before processing. HIPAA & GDPR compliant architecture by design.
             </p>
          </div>
          
          {/* Feature: Micro-calc */}
          <div className="md:col-span-2 bg-white rounded-4xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-4">
               <Microscope size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Micro-Calcification</h3>
             <p className="text-slate-600 text-sm leading-relaxed">
                Specialized detection for the subtle, granular signs of early-stage cancer that are hardest to spot.
             </p>
          </div>

        </div>
      </div>
    </section>
  );
}