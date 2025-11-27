import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ScanLine } from 'lucide-react';

export default function Header(){
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Mission', href: '#problem' },
    { name: 'Technology', href: '#solution' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-4 md:px-0 flex justify-center">
      <nav 
        className={`
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${scrolled || isOpen ? 'w-full md:w-[600px] bg-white/80 dark:bg-slate-900/80' : 'w-full md:w-[600px] bg-white/50'}
          backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2
        `}
      >
        <div className="flex justify-between items-center pl-4 pr-2">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 text-white overflow-hidden">
                <ScanLine size={16} className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-brand-400"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">MammoScan</span>
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-slate-100/50 rounded-xl p-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="group flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10"
            >
              Get Access
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 p-2 bg-white/50 rounded-xl border-t border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 mb-1"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-2 bg-slate-900 text-white px-4 py-3 rounded-lg font-bold text-sm"
            >
              Get Involved
            </a>
          </div>
        )}
      </nav>
    </div>
  );
};