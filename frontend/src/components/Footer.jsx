import React from 'react';
import { Cross, Heart, Sparkles, ArrowUp } from 'lucide-react';
import { EVENT_DETAILS } from '../data/mockData';

export default function Footer({ onOpenRegister }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#100906] text-white border-t border-[#d4af37]/30 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-[#d96b27]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#382015]">
          
          {/* Column 1: EDESSA & SMYM Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d96b27] to-[#150d09] p-0.5 border border-[#e5c158] flex items-center justify-center">
                <Cross className="w-5 h-5 text-[#e5c158]" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-black text-gold-gradient tracking-widest">
                  EDESSA 2026
                </h3>
                <p className="font-garamond italic text-xs text-[#e5c158]">
                  Called to Witness • SMYM Chemmalamattom
                </p>
              </div>
            </div>

            <p className="text-xs text-[#f4ece1]/75 max-w-md font-light leading-relaxed">
              Organized by the Syro-Malabar Youth Movement (SMYM) Chemmalamattom Unit. Empowering young hearts to build faith, fellowship, and leadership.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 rounded-xl bg-orange-gradient text-white text-xs font-bold shadow-md border border-[#e5c158]/50 hover:scale-105 transition-transform"
              >
                Register Now • ₹150
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-gold-gradient uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#f4ece1]/80">
              <li><a href="#home" className="hover:text-[#e5c158] transition-colors">Home & Countdown</a></li>
              <li><a href="#about" className="hover:text-[#e5c158] transition-colors">About EDESSA & Vision</a></li>
              <li><a href="#schedule" className="hover:text-[#e5c158] transition-colors">Programme Schedule</a></li>
              <li><a href="#speakers" className="hover:text-[#e5c158] transition-colors">Resource Persons</a></li>
              <li><a href="#gallery" className="hover:text-[#e5c158] transition-colors">Photo & Video Gallery</a></li>
              <li><a href="#sponsors" className="hover:text-[#e5c158] transition-colors">Sponsors & Patrons</a></li>
              <li><a href="#contact" className="hover:text-[#e5c158] transition-colors">Contact & Directions</a></li>
            </ul>
          </div>

          {/* Column 3: Event Brief */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-gold-gradient uppercase tracking-wider">
              Event Details
            </h4>
            <div className="bg-[#1a0f0a] p-4 rounded-2xl border border-[#d4af37]/20 space-y-2 text-xs">
              <p className="text-[#f4ece1]"><strong>Event:</strong> EDESSA Youth Meet 2026</p>
              <p className="text-[#f4ece1]"><strong>Date:</strong> 25 August 2026 (Tuesday)</p>
              <p className="text-[#f4ece1]"><strong>Venue:</strong> 12 Apostles Auditorium, Chemmalamattom</p>
              <p className="text-[#ff9e58] font-bold"><strong>Fee:</strong> ₹150 per participant</p>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f4ece1]/60">
          <p className="text-center sm:text-left">
            © 2026 EDESSA Youth Meet • Organized with <Heart className="w-3.5 h-3.5 inline text-[#d96b27]" /> by <strong>SMYM Chemmalamattom Unit</strong>.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-[#2a1a12] text-[#e5c158] hover:bg-[#d96b27] hover:text-white transition-colors border border-[#d4af37]/30 flex items-center gap-1.5 font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
