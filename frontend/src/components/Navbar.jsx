import React, { useState, useEffect } from 'react';
import { Menu, X, Cross, Calendar, MapPin, Sparkles } from 'lucide-react';
import { EVENT_DETAILS } from '../data/mockData';

export default function Navbar({ onOpenRegister }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-wood py-3 shadow-2xl border-b border-[#d4af37]/30' 
        : 'bg-gradient-to-b from-[#150d09]/90 via-[#150d09]/50 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Branding */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#d96b27] via-[#4a2c1d] to-[#150d09] p-0.5 shadow-lg shadow-[#d96b27]/20 border border-[#e5c158]/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-[#1e120b] flex items-center justify-center">
              <Cross className="w-5 h-5 text-[#e5c158] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#d96b27] animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-extrabold tracking-widest text-gold-gradient">
                EDESSA
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#d96b27]/20 text-[#ff9e58] border border-[#d96b27]/40">
                2026
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-garamond italic text-[#f4ece1]/80 tracking-wider">
              Called to Witness • SMYM Chemmalamattom
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-[#f4ece1]/90 hover:text-[#e5c158] transition-colors rounded-lg hover:bg-[#382015]/40"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="relative group overflow-hidden rounded-xl px-5 py-2.5 bg-orange-gradient font-bold text-sm text-white shadow-lg shadow-[#d96b27]/30 hover:shadow-[#d96b27]/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#e5c158]/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ffe8aa] animate-spin-slow" />
              Register Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-[#2a1a12] text-[#e5c158] border border-[#d4af37]/30 hover:bg-[#3d2417] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-wood border-b border-[#d4af37]/30 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-[#f4ece1] hover:text-[#e5c158] hover:bg-[#382015]/60 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-[#382015]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3 rounded-xl bg-orange-gradient font-bold text-center text-white shadow-lg shadow-[#d96b27]/30 border border-[#e5c158]/50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#ffe8aa]" />
                Register Now (₹150)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
