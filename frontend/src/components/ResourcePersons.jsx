import React from "react";
import { Mic, BookOpen, Sparkles, Cross } from "lucide-react";
import { RESOURCE_PERSONS } from "../data/mockData";

import frJoseph from "../assets/fr-joseph.jpg";
import edwinJosy from "../assets/edwin-josy.jpg";
import joseVince from "../assets/jose-vince.jpg";

const LOCAL_PHOTOS = {
  1: frJoseph,
  2: edwinJosy,
  3: joseVince,
};

export default function ResourcePersons() {
  return (
    <section id="speakers" className="py-20 bg-cream-section relative overflow-hidden text-[#2a1a12]">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Mic className="w-3.5 h-3.5" />
            Guiding Voices of Faith
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Resource Persons
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Inspired messengers of the Word, leading EDESSA 2026 — <em>"Called to Witness"</em>
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESOURCE_PERSONS.map((person) => (
            <div
              key={person.id}
              className="bg-wood-card rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-xl hover:shadow-2xl hover:border-[#d96b27]/60 transition-all duration-300 group flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-[#1a0f0a]">
                <img
                  src={LOCAL_PHOTOS[person.id]}
                  alt={person.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback avatar */}
                <div
                  className="w-full h-full items-center justify-center bg-[#2a1a12]"
                  style={{ display: "none" }}
                >
                  <div className="text-center text-[#e5c158]">
                    <div className="text-6xl mb-2">✝</div>
                    <p className="text-sm font-cinzel font-bold">{person.name}</p>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d120c] via-[#1d120c]/20 to-transparent opacity-80" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-gradient text-white shadow-lg border border-[#e5c158]/40 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#ffe8aa]" />
                    {person.badge}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 text-white space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-gold-gradient group-hover:text-amber-300 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#ff9e58] mt-1 tracking-wide leading-relaxed">
                    {person.designation}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#4a2c1d] space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#e5c158] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#f4ece1] font-semibold italic">
                        "{person.topic}"
                      </span>
                    </div>
                    <p className="text-xs text-[#f4ece1]/75 font-light leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#382015] flex items-center justify-between text-xs text-[#e5c158]">
                  <span className="font-garamond italic text-sm text-[#f4ece1]/70">EDESSA 2026</span>
                  <span className="font-bold flex items-center gap-1 text-[#d96b27]">✝ Featured</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scripture Banner */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#2a1a12] border border-[#d4af37]/30 max-w-2xl mx-auto text-white">
          <p className="font-garamond italic text-xl text-[#e5c158]">
            "Arise, shine, for your light has come, and the glory of the LORD rises upon you."
          </p>
          <p className="text-xs text-[#f4ece1]/70 mt-2 font-bold uppercase tracking-widest">— Isaiah 60:1</p>
        </div>
      </div>
    </section>
  );
}
