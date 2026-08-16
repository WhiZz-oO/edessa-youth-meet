import React from 'react';
import { Heart } from 'lucide-react';
import { SPONSORS_DATA } from '../data/mockData';

export default function Sponsors() {
  const hasGold = SPONSORS_DATA.goldSponsors && SPONSORS_DATA.goldSponsors.length > 0;
  const hasSilver = SPONSORS_DATA.silverSponsors && SPONSORS_DATA.silverSponsors.length > 0;

  return (
    <section id="sponsors" className="py-20 bg-cream-section text-[#2a1a12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5" />
            Support & Partnership
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Our Sponsors & Benefactors
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Gratitude to those who generously support EDESSA 2026
          </p>
        </div>

        {/* Title Sponsors */}
        {SPONSORS_DATA.titleSponsors && SPONSORS_DATA.titleSponsors.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {SPONSORS_DATA.titleSponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a1a12] text-white p-8 rounded-3xl border-2 border-[#d4af37]/40 shadow-xl flex flex-col items-center justify-center text-center hover:border-[#d96b27] transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#3d2417] text-[#e5c158] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-md">
                    ✝
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#d96b27] mb-2">
                    {sponsor.category || 'Official Sponsor'}
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-gold-gradient">
                    {sponsor.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gold Sponsors if any */}
        {hasGold && (
          <div className="mb-12">
            <h3 className="font-cinzel text-xl font-bold text-center text-[#4a2c1d] mb-6">Gold Partners</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {SPONSORS_DATA.goldSponsors.map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#d4af37]/30 shadow-md text-center">
                  <p className="font-cinzel font-bold text-lg text-[#1c120c]">{s.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Silver Sponsors if any */}
        {hasSilver && (
          <div>
            <h3 className="font-cinzel text-lg font-bold text-center text-[#4a2c1d] mb-4">Silver Partners</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {SPONSORS_DATA.silverSponsors.map((s, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="font-medium text-sm text-[#1c120c]">{s.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
