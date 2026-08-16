import React from 'react';
import { UserCheck, Mic, Award, Sparkles, BookOpen } from 'lucide-react';
import { RESOURCE_PERSONS } from '../data/mockData';

export default function ResourcePersons() {
  return (
    <section id="speakers" className="py-20 bg-cream-section relative overflow-hidden text-[#2a1a12]">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Mic className="w-3.5 h-3.5" />
            Guiding Voices
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Resource Persons
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Meet the inspiring mentors, keynote speakers, and spiritual leaders guiding EDESSA 2026.
          </p>
        </div>

        {/* Dynamic Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESOURCE_PERSONS.map((person) => (
            <div
              key={person.id}
              className="bg-wood-card rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-xl hover:shadow-2xl hover:border-[#d96b27]/60 transition-all duration-300 group flex flex-col justify-between"
            >
              
              {/* Top Photo & Badge Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d120c] via-transparent to-transparent opacity-80" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-gradient text-white shadow-lg border border-[#e5c158]/40 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#ffe8aa]" />
                    {person.badge}
                  </span>
                </div>
              </div>

              {/* Card Details Content */}
              <div className="p-6 text-white space-y-4 flex-grow flex flex-col justify-between">
                
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-gold-gradient group-hover:text-amber-300 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#ff9e58] mt-1 tracking-wide">
                    {person.designation}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#4a2c1d] space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#e5c158] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#f4ece1] font-semibold italic">
                        Topic: "{person.topic}"
                      </span>
                    </div>
                    <p className="text-xs text-[#f4ece1]/75 font-light leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                </div>

                {/* Profile Card Footer Action */}
                <div className="pt-4 border-t border-[#382015] flex items-center justify-between text-xs text-[#e5c158]">
                  <span className="font-garamond italic text-sm text-[#f4ece1]/70">EDESSA Keynote</span>
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                    Featured
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Extensibility Note */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white/70 border border-[#4a2c1d]/15 max-w-xl mx-auto">
          <p className="text-xs text-[#4a2c1d]/80 font-medium">
            ✨ More eminent spiritual leaders and youth icons will be announced soon. Stay tuned to our social handles!
          </p>
        </div>

      </div>
    </section>
  );
}
