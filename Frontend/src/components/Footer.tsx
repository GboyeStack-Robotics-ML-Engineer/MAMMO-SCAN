import { Activity, Twitter, Linkedin, Mail, ArrowRight, Github } from 'lucide-react';
import { SectionId } from '../types';

export default function Footer() {
  return (
    <footer id={SectionId.CONTACT} className="bg-slate-950 text-slate-300 relative pt-32 pb-12 overflow-hidden">
      
      {/* Background Grid/Glow */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Centralized CTA Card */}
        <div className="relative -mt-48 mb-20">
           <div className="max-w-5xl mx-auto bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-16 text-center border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Card Glow Effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
              <div className="absolute -top-[100px] -right-[100px] w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-[100px] -left-[100px] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>

              <div className="relative z-10 top-10 pb-8">
                 <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Ready to transform <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-300 to-cyan-300">healthcare access?</span>
                 </h2>
                 <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    We are actively seeking pilot clinics in Nigeria for our Q3 2025 beta program. Join the movement to democratize early detection.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-brand-600 hover:bg-brand-500 text-white text-lg px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group">
                       Partner With Us 
                       <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid md:grid-cols-12 gap-12 border-t border-white/10 pt-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="bg-brand-600 p-1.5 rounded-lg">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight">MammoScan</span>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
              An AI-powered assistant designed to bridge the specialist gap in low-resource settings. Early detection, democratized.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5 hover:border-white/20 hover:scale-110">
                    <Icon size={18} />
                 </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Features', 'Technology', 'Case Studies', 'Security'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-brand-400 transition-colors block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {['About Us', 'Team', 'Careers', 'Blog'].map((item) => (
                 <li key={item}><a href="#" className="hover:text-brand-400 transition-colors block">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 Lagos, Nigeria
              </li>
              <li>
                 <a href="mailto:gboyebolt@gmail.com" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <Mail size={16} className="group-hover:text-brand-400 transition-colors" /> gboyebolt@gmail.com
                 </a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>&copy; 2025 Mammo Scan. All rights reserved. <span className="opacity-50 mx-2">|</span> Built for Founder Academy 2025</p>
          <div className="flex gap-8">
             <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}