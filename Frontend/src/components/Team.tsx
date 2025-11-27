import { SectionId } from '../types';
import { Code2, Database, Stethoscope, LineChart, Linkedin, ArrowRight, UserCheck } from 'lucide-react';

export default function Team() {
  const members = [
    {
      role: "AI Lead & Fullstack",
      desc: "Architecting the core inference engine and scalable cloud infrastructure.",
      icon: <Database className="w-6 h-6" />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      delay: "delay-0"
    },
    {
      role: "Frontend Engineer",
      desc: "Crafting intuitive interfaces for health workers in low-resource settings.",
      icon: <Code2 className="w-6 h-6" />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      delay: "delay-100"
    },
    {
      role: "Data Scientist",
      desc: "Curating datasets and refining model weights for maximum sensitivity.",
      icon: <LineChart className="w-6 h-6" />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      delay: "delay-200"
    }
  ];

  return (
    <section id={SectionId.TEAM} className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header - Centered & Symmetrical */}
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              <UserCheck size={14} />
              The Builders
           </div>
           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Built by Engineers, <br/>Guided by Doctors.</h2>
           <p className="text-slate-600 text-lg leading-relaxed">
             We combine robust technical expertise with deep clinical insights to solve real-world problems.
           </p>
        </div>

        {/* Core Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {members.map((member, idx) => (
            <div key={idx} className={`group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-100 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center ${member.delay}`}>
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${member.color} border shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {member.icon}
              </div>
              
              <h3 className="font-bold text-xl text-slate-900 mb-3">{member.role}</h3>
              <p className="text-slate-500 leading-relaxed mb-8 text-sm">{member.desc}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 w-full flex justify-center">
                 <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-600 transition-colors group-hover/btn:gap-3">
                    <Linkedin size={18} /> Connect
                 </button>
              </div>
              
              {/* Decorative Gradient Blob */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}