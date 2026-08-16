import React from "react";
import { Images, Clock } from "lucide-react";

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-[#0f0804] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5c158]/10 text-[#e5c158] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Images className="w-3.5 h-3.5" />
            Event Gallery
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Moments & Memories
          </h2>
          <p className="font-garamond text-xl italic text-[#f4ece1]/70">
            Glimpses from EDESSA 2026 - Called to Witness
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-[#d4af37]/30 bg-[#1a0f0a]/50 text-center gap-6">
          <div className="p-6 rounded-full bg-[#2a1a12] border border-[#d4af37]/20">
            <Clock className="w-16 h-16 text-[#e5c158]" />
          </div>
          <div>
            <h3 className="font-cinzel text-2xl font-bold text-white mb-2">Photos Coming Soon</h3>
            <p className="text-[#f4ece1]/60 font-garamond text-lg max-w-md">
              Event photos and memories will be added here after EDESSA 2026.
              Check back on 25 August 2026!
            </p>
          </div>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#d96b27]/10 border border-[#d96b27]/30">
            <span className="text-[#ff9e58] font-bold text-sm">EDESSA 2026 - Called to Witness</span>
          </div>
        </div>
      </div>
    </section>
  );
}
