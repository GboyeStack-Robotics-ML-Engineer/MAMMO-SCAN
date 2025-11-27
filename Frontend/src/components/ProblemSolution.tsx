import { AlertTriangle, Clock, Activity, CheckCircle2, Search, FileCheck, Brain, MessageSquare, Shield } from 'lucide-react';
import { SectionId } from '../types';

export default function ProblemSolution() {
  return (
    <div className="flex flex-col">
      
      {/* PROBLEM SECTION */}
      <section id={SectionId.PROBLEM} className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-900/20 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <AlertTriangle size={14} />
                  The Crisis
               </div>
               <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Late Diagnosis is a <br/>
                  <span className="text-red-400">Silent Killer.</span>
               </h2>
               <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  In underserved African communities, breast cancer survival rates are alarmingly low. The barriers are systemic, but the outcome is personal and devastating.
               </p>
               
               <div className="space-y-4">
                  {[
                     {
                        title: "Broken Infrastructure",
                        desc: "Equipment is often expensive, scarce, or out of service.",
                        icon: <Activity className="text-red-400" size={20} />
                     },
                     {
                        title: "Specialist Shortage",
                        desc: "A critical lack of radiologists leads to massive backlogs.",
                        icon: <Clock className="text-red-400" size={20} />
                     },
                     {
                        title: "The 'Black Box' Problem",
                        desc: "Existing tools are opaque, leaving health workers unsure of results.",
                        icon: <Search className="text-red-400" size={20} />
                     }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="mt-1">{item.icon}</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                           <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="relative flex justify-center">
               <div className="relative w-72 h-72">
                 <div className="absolute inset-0 rounded-full border border-slate-700 animate-[spin_10s_linear_infinite]"></div>
                 <div className="absolute inset-4 rounded-full border border-slate-700/50 animate-[spin_15s_linear_infinite_reverse]"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 bg-slate-900 rounded-full border border-slate-800 shadow-2xl relative z-10">
                       <span className="block text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-slate-500">60%</span>
                       <span className="text-xs font-bold text-red-400 tracking-widest uppercase mt-2 block">Late Diagnosis</span>
                    </div>
                 </div>
                 {/* Decorative dots */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION - Enhanced Narrative Flow */}
      <section id={SectionId.SOLUTION} className="py-24 bg-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,var(--tw-gradient-stops))] from-slate-50 via-transparent to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
           
           <div className="text-center max-w-3xl mx-auto mb-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest mb-6">
                  <FileCheck size={14} />
                  Our Solution
               </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                 We Don't Just Detect.<br/>
                 <span className="text-brand-600">We Explain.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                 Mammo Scan bridges the gap between complex AI and clinical reality. We've built a three-stage pipeline designed for trust and transparency.
              </p>
           </div>

           <div className="space-y-24">
              
              {/* Step 1: Deep Scan */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative group">
                   {/* Graphic Mockup */}
                   <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl transform rotate-1 transition-transform group-hover:rotate-0 duration-500 border border-slate-800">
                      <div className="bg-slate-800 rounded-xl overflow-hidden aspect-video relative">
                         {/* Scan Animation */}
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
                         <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-brand-500/10 to-transparent animate-pulse"></div>
                         <div className="absolute top-[30%] left-[40%] w-24 h-24 border-2 border-dashed border-brand-400 rounded-full animate-ping opacity-20"></div>
                         <div className="absolute top-[30%] left-[40%] w-24 h-24 border border-brand-400 rounded-full flex items-center justify-center">
                            <div className="bg-brand-500 h-1.5 w-1.5 rounded-full"></div>
                         </div>
                         
                         {/* UI Overlay */}
                         <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                            <div className="text-xs font-mono text-brand-100">Scanning sector 7... Micro-calcification detected.</div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-brand-100 rounded-2xl"></div>
                </div>
                
                <div className="order-1 lg:order-2">
                   <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                      <Search size={24} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">01. Pixel-Level Precision</h3>
                   <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      Our custom CNN architecture doesn't just look at the whole image. It scans pixel-by-pixel to identify suspicious masses and micro-calcifications that are often invisible to the naked eye in low-quality scans.
                   </p>
                   <ul className="space-y-3">
                      {['Trained on diverse African datasets', 'High sensitivity for early-stage detection', 'Works with standard digital mammograms'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                           <CheckCircle2 size={18} className="text-brand-500 shrink-0" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>

              {/* Step 2: LLM Context */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                   <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                      <Brain size={24} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">02. The "Why" Engine</h3>
                   <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      Detection is useless without context. We augment our visual findings with a Large Language Model (LLM) that acts as a virtual senior radiologist, explaining the findings in clear, medical terms.
                   </p>
                   <ul className="space-y-3">
                      {['Generates BI-RADS compliant reports', 'Explains reasoning behind every flag', 'Reduces "black box" anxiety'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                           <CheckCircle2 size={18} className="text-purple-500 shrink-0" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="relative group">
                   {/* Graphic Mockup - Report View */}
                   <div className="relative rounded-2xl bg-white p-6 shadow-xl border border-slate-100 transform -rotate-1 transition-transform group-hover:rotate-0 duration-500 z-10">
                      <div className="flex items-start gap-4 mb-4">
                         <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                            <MessageSquare size={20} />
                         </div>
                         <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none text-sm text-slate-600 leading-relaxed border border-slate-100">
                            <span className="font-bold text-slate-900 block mb-2">AI Analysis Report</span>
                            "I have identified a <span className="bg-red-100 text-red-700 px-1 rounded font-medium">suspicious mass</span> in the upper outer quadrant. The irregular margins suggest a high probability of malignancy (BIRADS-4). Immediate biopsy recommended."
                         </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 ml-14">
                         <span className="text-xs font-bold text-slate-400">CONTEXTUAL CONFIDENCE</span>
                         <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[92%]"></div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-6 -right-6 -z-10 w-full h-full bg-purple-100 rounded-2xl border border-purple-200"></div>
                </div>
              </div>

              {/* Step 3: Empowerment */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative group">
                   {/* Graphic Mockup - Success State */}
                   <div className="relative rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-8 shadow-2xl text-white transform rotate-1 transition-transform group-hover:rotate-0 duration-500">
                      <Shield className="w-16 h-16 text-emerald-100 mb-6 opacity-80" />
                      <h4 className="text-2xl font-bold mb-2">Clinician Empowered</h4>
                      <p className="text-emerald-100 mb-6">Diagnosis confirmed. Treatment path initiated 2 weeks earlier than average.</p>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                         <div className="flex justify-between items-end">
                            <div>
                               <div className="text-xs text-emerald-100 uppercase font-bold tracking-wider">Patient Outcome</div>
                               <div className="text-2xl font-bold">Treatable</div>
                            </div>
                            <div className="bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                               High Priority
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute -bottom-6 -left-6 -z-10 w-full h-full bg-emerald-50 rounded-2xl border border-emerald-100"></div>
                </div>

                <div className="order-1 lg:order-2">
                   <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                      <CheckCircle2 size={24} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-4">03. Actionable Trust</h3>
                   <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      We don't replace the radiologist; we give them a reliable second opinion. By being transparent about <em>how</em> the conclusion was reached, we build the trust necessary for swift clinical action.
                   </p>
                   <ul className="space-y-3">
                      {['Supports task-shifting to non-specialists', 'Reduces referral bottlenecks', 'Empowers local clinics'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                           <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>

           </div>
           
        </div>
      </section>
    </div>
  );
}