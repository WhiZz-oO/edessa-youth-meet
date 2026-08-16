import React from 'react';
import { Award, Star, Heart, Shield } from 'lucide-react';
import { SPONSORS_DATA } from '../data/mockData';

export default function Sponsors() {
  return (
    <section id="sponsors" className="py-20 bg-cream-section relative overflow-hidden text-[#2a1a12]">
      
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            Patrons & Supporters
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Our Event Sponsors
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Generous patrons empowering EDESSA Youth Meet 2026.
          </p>
        </div>

        {/* Tier 1: Title Sponsors */}
        <div className="mb-14">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
            <h3 className="font-cinzel text-xl font-bold text-[#1c120c] uppercase tracking-wider">
              Title & Principal Partners
            </h3>
            <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SPONSORS_DATA.titleSponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="bg-wood-card p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37] text-white shadow-2xl flex items-center gap-6 hover:scale-[1.02] transition-transform"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-gradient text-3xl flex items-center justify-center shadow-inner flex-shrink-0">
                  {sponsor.logo}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#d96b27]/30 text-[#ff9e58] border border-[#d96b27]/40">
                    {sponsor.category}
                  </span>
                  <h4 className="font-cinzel text-xl font-bold text-gold-gradient mt-1">
                    {sponsor.name}
                  </h4>
                  <p className="text-xs text-[#f4ece1]/70 mt-1">Primary Event Benefactor</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Gold Partners */}
        <div className="mb-14">
          <h3 className="font-cinzel text-lg font-bold text-center text-[#4a2c1d] uppercase tracking-wider mb-6">
            Gold Category Sponsors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SPONSORS_DATA.goldSponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#4a2c1d]/20 text-center shadow-lg hover:border-[#d96b27] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4a2c1d]/10 text-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {sponsor.logo}
                </div>
                <span className="text-[10px] font-bold text-[#d96b27] uppercase tracking-wider block">
                  {sponsor.category}
                </span>
                <h4 className="font-cinzel text-base font-bold text-[#1c120c] mt-1">
                  {sponsor.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Silver Supporters */}
        <div>
          <h3 className="font-cinzel text-sm font-bold text-center text-[#4a2c1d]/70 uppercase tracking-wider mb-6">
            Silver & Support Partners
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {SPONSORS_DATA.silverSponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="bg-white/60 p-4 rounded-xl border border-[#4a2c1d]/10 text-center shadow-sm hover:shadow-md transition-all flex items-center gap-3 justify-center"
              >
                <span className="text-xl">{sponsor.logo}</span>
                <div className="text-left">
                  <h5 className="font-cinzel text-xs font-bold text-[#1c120c]">{sponsor.name}</h5>
                  <p className="text-[10px] text-[#4a2c1d]/60">{sponsor.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2a1a12] text-[#e5c158] font-bold text-xs uppercase tracking-wider border border-[#d4af37]/40 hover:bg-[#382015] transition-all"
          >
            <Heart className="w-4 h-4 text-[#d96b27]" />
            Become a Sponsor / Partner for EDESSA 2026
          </a>
        </div>

      </div>
    </section>
  );
}
