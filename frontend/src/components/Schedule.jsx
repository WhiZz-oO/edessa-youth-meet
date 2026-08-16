import React, { useState } from 'react';
import { 
  UserCheck, Sparkles, Utensils, Flame, Coffee, Heart, Music, Clock, 
  CalendarCheck, ChevronRight, Mic, BookOpen, Star, Home
} from 'lucide-react';
import { SCHEDULE_DATA } from '../data/mockData';

export default function Schedule() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Registration', 'Keynote', 'Spiritual', 'Prayer', 'Food', 'Cultural', 'Break', 'Closing'];

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
      case 'Mic': return <Mic className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <section id="schedule" className="py-20 bg-wood-dark relative overflow-hidden text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d96b27]/10 text-[#ff9e58] text-xs font-extrabold uppercase tracking-widest mb-3 border border-[#d96b27]/20">
            <CalendarCheck className="w-3.5 h-3.5" />
            Programme Schedule
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient mb-4">
            Day Itinerary
          </h2>
          <p className="font-garamond text-xl italic text-[#f4ece1]/80">
            25 August 2026 • Tuesday • 12 Apostles Auditorium, Chemmalamattom
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeFilter === cat
                  ? 'bg-orange-gradient text-white shadow-lg shadow-[#d96b27]/30 scale-105 border border-[#e5c158]/50'
                  : 'bg-[#1e130d] text-[#f4ece1]/70 hover:text-white hover:bg-[#2e1c14] border border-[#d4af37]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredSchedule.map((item, index) => (
            <div
              key={index}
              className="bg-[#1c120c] rounded-2xl p-5 sm:p-6 border border-[#d4af37]/20 shadow-lg hover:border-[#d96b27]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-[#2e1c14] text-[#e5c158] border border-[#d4af37]/30 group-hover:bg-[#d96b27] group-hover:text-white transition-colors flex-shrink-0">
                  {getCategoryIcon(item.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-[#ff9e58] font-cinzel">
                      {item.time}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#3d2417] text-[#e5c158] border border-[#e5c158]/20">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-1 group-hover:text-[#ffe8aa] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#f4ece1]/70 font-light mt-1 max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center text-[#e5c158]/40 group-hover:text-[#e5c158] group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
