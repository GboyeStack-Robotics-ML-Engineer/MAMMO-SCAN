import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { ButtonOn } from './ui/ButtonOn';
import { SectionId } from '../types';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: SectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection(SectionId.HERO)}>
            <div className="bg-[#0069ca] p-1.5 rounded-lg text-white">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              Mammo<span className="text-brand-600">Scan</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'The Problem', id: SectionId.PROBLEM },
              { label: 'Our Solution', id: SectionId.SOLUTION },
              { label: 'Technology', id: SectionId.FEATURES },
              { label: 'Team', id: SectionId.TEAM },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <ButtonOn size="sm" onClick={() => scrollToSection(SectionId.CONTACT)}>
              Partner With Us
            </ButtonOn>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 md:hidden shadow-xl flex flex-col gap-4">
          {[
              { label: 'The Problem', id: SectionId.PROBLEM },
              { label: 'Our Solution', id: SectionId.SOLUTION },
              { label: 'Technology', id: SectionId.FEATURES },
              { label: 'Team', id: SectionId.TEAM },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-left text-sm font-medium text-slate-600 hover:text-brand-600 py-2"
            >
              {item.label}
            </button>
          ))}
          <ButtonOn fullWidth onClick={() => scrollToSection(SectionId.CONTACT)}>
            Partner With Us
          </ButtonOn>
        </div>
      )}
    </header>
  );
}