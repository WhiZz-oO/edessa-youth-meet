import React from 'react';
import { 
  UserCheck, Sparkles, Utensils, Coffee, Heart, Music, Clock, 
  CalendarCheck, Mic, BookOpen, Star, Home, Smartphone, Smile
} from 'lucide-react';
import { SCHEDULE_DATA } from '../data/mockData';

export default function Schedule() {
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      case 'Mic': return <Mic className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <section id="schedule" className="py-20 bg-wood-dark relative overflow-hidden text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d96b27]/10 text-[#ff9e58] text-xs font-extrabold uppercase tracking-widest mb-3 border border-[#d96b27]/20 shadow-sm">
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

        {/* Timeline Container */}
        <div className="relative pl-8 sm:pl-10 border-l-2 border-[#d4af37]/30 space-y-8 max-w-3xl mx-auto">
          {SCHEDULE_DATA.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline Dot / Icon */}
              <div className="absolute -left-[49px] sm:-left-[57px] top-1.5 w-10 h-10 rounded-full bg-[#2a1a12] border-2 border-[#d4af37] flex items-center justify-center text-[#e5c158] shadow-lg group-hover:bg-[#d96b27] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                {getCategoryIcon(item.iconName)}
              </div>

              {/* Event Content Card */}
              <div className="bg-[#1c120c] rounded-2xl p-5 sm:p-6 border border-[#d4af37]/20 shadow-lg hover:border-[#d96b27]/50 hover:shadow-[#d96b27]/10 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#ff9e58] bg-[#3d2417] border border-[#d96b27]/30 font-cinzel w-fit">
                    <Clock className="w-3.5 h-3.5" />
                    {item.time}
                  </span>
                </div>

                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-gold-gradient transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#f4ece1]/75 font-light mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Note Banner */}
        <div className="mt-14 text-center p-6 rounded-2xl bg-[#1c120c] border border-[#d4af37]/30 max-w-xl mx-auto">
          <p className="font-garamond italic text-lg text-[#e5c158]">
            "Arise, shine, for your light has come!"
          </p>
          <p className="text-xs text-[#f4ece1]/60 font-semibold tracking-wider uppercase mt-1">
            EDESSA 2026 • Chemmalamattom
          </p>
        </div>

      </div>
    </section>
  );
}
