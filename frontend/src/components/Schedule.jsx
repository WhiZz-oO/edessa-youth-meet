import React, { useState } from 'react';
import { 
  UserCheck, Sparkles, Utensils, Flame, Coffee, Heart, Music, Clock, 
  CalendarCheck, ChevronRight 
} from 'lucide-react';
import { SCHEDULE_DATA } from '../data/mockData';

export default function Schedule() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Registration', 'Cultural', 'Food', 'Keynote', 'Spiritual', 'Closing'];

  const filteredSchedule = activeFilter === 'All'
    ? SCHEDULE_DATA
    : SCHEDULE_DATA.filter((item) => item.category === activeFilter);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <section id="schedule" className="py-20 bg-wood-dark relative overflow-hidden text-white">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#d96b27]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d2417] text-[#e5c158] text-xs font-bold uppercase tracking-widest border border-[#d4af37]/30 mb-3">
            <CalendarCheck className="w-3.5 h-3.5" />
            Programme Timeline
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient mb-4">
            Event Schedule
          </h2>
          <p className="text-sm sm:text-base text-[#f4ece1]/80 max-w-xl mx-auto font-light">
            Plan your day for August 25, 2026. A rich blend of Onam cultural joy, spiritual prayer, and empowering youth sessions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-orange-gradient text-white shadow-lg shadow-[#d96b27]/30 border border-[#e5c158]/60 scale-105'
                  : 'bg-[#2a1a12] text-[#f4ece1]/70 hover:text-white hover:bg-[#382015] border border-[#d4af37]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline Cards Container */}
        <div className="relative border-l-2 border-[#d4af37]/30 ml-4 sm:ml-32 space-y-8">
          
          {filteredSchedule.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-10 group">
              
              {/* Timeline Connector Bullet Pin */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#1c120c] border-2 border-[#e5c158] flex items-center justify-center group-hover:scale-125 group-hover:border-[#d96b27] group-hover:bg-[#d96b27] transition-all shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e5c158] group-hover:bg-white" />
              </div>

              {/* Time Label (Visible on desktop on the left) */}
              <div className="hidden sm:block absolute -left-36 top-2 text-right w-28">
                <span className="font-cinzel text-xs font-bold text-[#e5c158] block">
                  {item.time}
                </span>
                <span className="text-[10px] text-[#f4ece1]/60 uppercase tracking-wider">
                  Aug 25, 2026
                </span>
              </div>

              {/* Event Card */}
              <div className="bg-wood-card p-6 rounded-2xl border border-[#d4af37]/20 hover:border-[#d96b27]/50 shadow-xl transition-all duration-300 group-hover:translate-x-1">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  
                  {/* Time badge for mobile */}
                  <span className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#e5c158] bg-[#1a0f0a] px-3 py-1 rounded-lg border border-[#e5c158]/20 self-start">
                    <Clock className="w-3 h-3 text-[#d96b27]" />
                    {item.time}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
                      {getCategoryIcon(item.iconName)}
                    </div>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-[#e5c158] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#d96b27]/15 text-[#ff9e58] border border-[#d96b27]/30 self-start sm:self-auto">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#f4ece1]/80 font-light leading-relaxed">
                  {item.description}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Bottom Schedule Callout */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[#f4ece1]/60 italic font-garamond text-base">
            * Timings are subject to minor adjustments on the event day to accommodate spiritual and cultural activities.
          </p>
        </div>

      </div>
    </section>
  );
}
