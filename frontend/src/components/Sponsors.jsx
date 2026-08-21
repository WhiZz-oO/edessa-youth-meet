import React from 'react';
import { Heart, Sparkles, Award } from 'lucide-react';
import { SPONSORS_DATA } from '../data/mockData';

export default function Sponsors() {
  const sponsors = SPONSORS_DATA.titleSponsors || [];

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

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sponsors.map((sponsor, idx) => (
            <div
              key={idx}
              className="bg-[#2a1a12] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/40 shadow-xl flex flex-col items-center justify-center text-center hover:border-[#d96b27] hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-full bg-[#3d2417] border border-[#d4af37]/40 flex items-center justify-center mb-3 group-hover:bg-[#d96b27]/20 transition-colors">
                <Sparkles className="w-5 h-5 text-[#e5c158]" />
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient tracking-wide leading-snug">
                {sponsor.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
