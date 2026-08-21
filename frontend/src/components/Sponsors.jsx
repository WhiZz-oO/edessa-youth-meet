import React from 'react';
import { Heart, Sparkles, Award, Star } from 'lucide-react';
import { SPONSORS_DATA } from '../data/mockData';

export default function Sponsors() {
  const mainSponsors = SPONSORS_DATA.mainSponsors || [];
  const otherSponsors = SPONSORS_DATA.otherSponsors || [];

  return (
    <section id="sponsors" className="py-20 bg-cream-section text-[#2a1a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#d96b27]" />
            Support &amp; Benefactors
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Our Generous Sponsors
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Gratitude to our parish benefactors who wholeheartedly support EDESSA 2026
          </p>
        </div>

        {/* 1. FIRST ROW: MAIN SPONSORS (Large Font & Prominent Cards) */}
        {mainSponsors.length > 0 && (
          <div className="mb-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {mainSponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a1a12] text-white p-8 sm:p-10 rounded-3xl border-2 border-[#d4af37] shadow-2xl flex flex-col items-center justify-center text-center hover:border-[#d96b27] hover:scale-[1.02] transition-all group relative overflow-hidden"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d96b27]/20 border border-[#d96b27]/40 text-[#e5c158] text-[11px] font-bold uppercase tracking-widest mb-4">
                    <Star className="w-3.5 h-3.5 fill-[#e5c158]" />
                    Main Sponsor
                  </div>

                  <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-gradient tracking-wide leading-tight">
                    {sponsor.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. OTHER SPONSORS (8 Perfectly Balanced Cards in 4-Column Grid) */}
        {otherSponsors.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {otherSponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a1a12] text-white p-5 sm:p-6 rounded-2xl border border-[#d4af37]/35 shadow-lg flex flex-col items-center justify-center text-center hover:border-[#d4af37] hover:scale-[1.02] transition-all group relative"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3d2417] border border-[#d4af37]/30 flex items-center justify-center mb-2.5 group-hover:bg-[#d96b27]/20 transition-colors">
                    <Sparkles className="w-4 h-4 text-[#e5c158]" />
                  </div>
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-gold-gradient tracking-wide leading-snug">
                    {sponsor.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
