import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Clock, Activity, CheckCircle2, Search, FileCheck, Brain, MessageSquare, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionId } from '../types';
import { MedicalScene } from './three/MedicalScene';

type SolutionStep = {
   title: string;
   description: string;
   highlights: string[];
   metric: string;
   icon: LucideIcon;
};

const solutionSteps: SolutionStep[] = [
   {
      title: '1. Smart Intake & QA',
      description: 'Capture or upload scans from any device. Automatic quality checks flag exposures, artifacts, and positioning issues before analysis begins.',
      highlights: [
         'Offline-first capture workstation',
         'Instant de-noise & contrast normalization',
         'Technologist guidance with voice prompts',
      ],
      metric: '98% image QA pass rate',
      icon: Activity,
   },
   {
      title: '2. Dual-Engine Analysis',
      description: 'Our hybrid CNN + LLM engine reads pixel-level signals and contextual notes simultaneously, producing nuanced findings in seconds.',
      highlights: [
         'Lesion segmentation with confidence heatmaps',
         'Breast density classification (BI-RADS)',
         'Explainable narratives in clinician language',
      ],
      metric: '12s median inference time',
      icon: Brain,
   },
   {
      title: '3. Collaborative Review',
      description: 'Push structured results to specialists on any device. Radiologists can add remarks, reply inline, and approve reports for EMR export.',
      highlights: [
         'Realtime comments & audio notes',
         'Consensus scoring with audit trail',
         'One-click referral packets',
      ],
      metric: '45% faster turnaround',
      icon: MessageSquare,
   },
   {
      title: '4. Follow-up & Coaching',
      description: 'Risk scores trigger reminder cadences, patient SMS updates, and outreach scripts so no case falls through the cracks.',
      highlights: [
         'Automated follow-up queue',
         'Population health dashboard',
         'Community navigator playbooks',
      ],
      metric: '3x adherence to re-screening',
      icon: Shield,
   },
];

function LateDiagnosisGauge() {
   const target = 60;
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      let start: number | null = null;
      let frameId: number;
      const duration = 1600;

      const animate = (timestamp: number) => {
         if (start === null) start = timestamp;
         const elapsed = timestamp - start;
         const ratio = Math.min(elapsed / duration, 1);
         setProgress(ratio * target);
         if (ratio < 1) {
            frameId = requestAnimationFrame(animate);
         }
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
   }, []);

   const radius = 100;
   const circumference = 2 * Math.PI * radius;
   const clampedProgress = Math.min(progress, target);
   const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
   const displayValue = Math.round(clampedProgress);

   return (
      <div className="relative w-60 h-60 pointer-events-none select-none">
         <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
            <defs>
               <linearGradient id="late-diagnosis-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#fb923c" />
               </linearGradient>
            </defs>
            <circle
               cx="130"
               cy="130"
               r={radius}
               stroke="rgba(248, 250, 252, 0.15)"
               strokeWidth="18"
               fill="transparent"
            />
            <circle
               cx="130"
               cy="130"
               r={radius}
               stroke="url(#late-diagnosis-ring)"
               strokeWidth="18"
               strokeLinecap="round"
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               fill="transparent"
               className="transition-[stroke-dashoffset] duration-300 ease-out"
            />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="text-5xl font-black text-white tracking-tight leading-none">{displayValue}%</span>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-300 mt-3">
               Late Diagnosis
            </span>
            <span className="text-[13px] text-slate-200/90 mt-3 leading-relaxed">
               of patients only receive a diagnosis after Stage II in underserved regions.
            </span>
         </div>
      </div>
   );
}

export default function ProblemSolution() {
   const [currentStep, setCurrentStep] = useState(0);
   const totalSteps = solutionSteps.length;

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentStep((prev) => (prev + 1) % totalSteps);
      }, 8000);

      return () => clearInterval(interval);
   }, [totalSteps]);

   const goToStep = (delta: number) => {
      setCurrentStep((prev) => (prev + delta + totalSteps) % totalSteps);
   };

   return (
      <div className="flex flex-col">
         {/* PROBLEM SECTION */}
         <section id={SectionId.PROBLEM} className="relative py-24 bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-brand-900/20 to-transparent"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-[1.05fr_1fr] gap-16 items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                        <AlertTriangle size={14} />
                        The Crisis
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Late Diagnosis is a <br />
                        <span className="text-red-400">Silent Killer.</span>
                     </h2>
                     <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                        In underserved African communities, breast cancer survival rates are alarmingly low. The barriers are systemic, but the outcome is personal and devastating.
                     </p>

                     <div className="space-y-4">
                        {[
                           {
                              title: 'Broken Infrastructure',
                              desc: 'Equipment is often expensive, scarce, or out of service.',
                              icon: <Activity className="text-red-400" size={20} />,
                           },
                           {
                              title: 'Specialist Shortage',
                              desc: 'A critical lack of radiologists leads to massive backlogs.',
                              icon: <Clock className="text-red-400" size={20} />,
                           },
                           {
                              title: "The 'Black Box' Problem",
                              desc: 'Existing tools are opaque, leaving health workers unsure of results.',
                              icon: <Search className="text-red-400" size={20} />,
                           },
                        ].map((item, i) => (
                           <div
                              key={i}
                              className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                           >
                              <div className="mt-1 text-red-400">{item.icon}</div>
                              <div>
                                 <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                 <p className="text-slate-300/80 text-sm leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="relative order-first lg:order-last">
                     <div className="relative h-[420px] rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_30px_120px_rgba(15,23,42,0.45)]">
                        <LateDiagnosisGauge />
                        <div className="absolute top-6 left-6 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 backdrop-blur-md">
                           <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200">
                              <AlertTriangle size={14} />
                              Field Reality
                           </div>
                           <p className="mt-2 text-sm text-slate-100/80 max-w-[14rem]">
                              4 in 10 patients only reach clinics at Stage III or IV — the window for lifesaving intervention is narrow.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* SOLUTION SECTION */}
         <section id={SectionId.SOLUTION} className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,var(--tw-gradient-stops))] from-slate-50 via-transparent to-transparent opacity-60"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
               <div className="text-center max-w-3xl mx-auto mb-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                     <FileCheck size={14} />
                     Our Solution
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                     We Don&apos;t Just Detect.<br />
                     <span className="text-brand-600">We Explain &amp; Orchestrate.</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                     Mammo Scan bridges the gap between complex AI and clinical reality. Swipe through the pipeline that gets patients from screening to treatment faster.
                  </p>
               </div>

               <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
                  <div className="order-2 lg:order-1">
                     <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div
                           className="flex transition-transform duration-500"
                           style={{ transform: `translateX(-${currentStep * 100}%)` }}
                        >
                           {solutionSteps.map((step, index) => {
                              const Icon = step.icon;
                              return (
                                 <div key={step.title} className="min-w-full px-8 py-10 md:px-12 md:py-12">
                                    <div className="flex flex-col gap-6">
                                       <div className="flex items-center justify-between gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                                             <Icon size={26} strokeWidth={2.4} />
                                          </div>
                                          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                             {step.metric}
                                          </span>
                                       </div>
                                       <div>
                                          <p className="text-sm font-semibold text-brand-500 uppercase tracking-[0.2em] mb-3">
                                             Step {index + 1}
                                          </p>
                                          <h3 className="text-3xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                          <p className="text-lg text-slate-600 leading-relaxed">
                                             {step.description}
                                          </p>
                                       </div>
                                       <div className="grid sm:grid-cols-2 gap-3">
                                          {step.highlights.map((highlight) => (
                                             <div
                                                key={highlight}
                                                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                                             >
                                                <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5" />
                                                <span>{highlight}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>

                        <div className="flex items-center justify-between px-8 md:px-12 py-6 border-t border-slate-100 bg-slate-50/70 backdrop-blur-sm">
                           <div className="flex items-center gap-2">
                              {solutionSteps.map((_, index) => (
                                 <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    aria-label={`Go to solution step ${index + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                       currentStep === index
                                          ? 'w-10 bg-brand-500'
                                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                 />
                              ))}
                           </div>
                           <div className="flex items-center gap-3">
                              <button
                                 onClick={() => goToStep(-1)}
                                 aria-label="Previous step"
                                 className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
                              >
                                 <ChevronLeft size={20} />
                              </button>
                              <button
                                 onClick={() => goToStep(1)}
                                 aria-label="Next step"
                                 className="p-2 rounded-full border border-brand-500 text-brand-600 hover:bg-brand-50 transition-colors"
                              >
                                 <ChevronRight size={20} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="order-1 lg:order-2">
                     <div className="relative h-[440px] rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
                        <MedicalScene
                           className="w-full h-full"
                           glowColor="#22d3ee"
                           ambientIntensity={0.65}
                           disableControls={false}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shadow">
                                 <Activity size={18} />
                              </div>
                              <div>
                                 <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Live Rollouts</p>
                                 <p className="text-slate-900 font-semibold">10 countries | 68 partner clinics</p>
                              </div>
                           </div>
                           <p className="text-sm text-slate-600 mt-3">
                              Click and drag to orbit the workflow. Every node represents a clinic connected to Mammo Scan.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
}