import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Cross, Sparkles, Heart } from 'lucide-react';
import { EVENT_DETAILS } from '../data/mockData';

export default function Hero({ onOpenRegister }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.targetDateStr).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center bg-wood-dark overflow-hidden">
      
      {/* Visual Ambient Halo Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#d96b27]/20 via-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#d96b27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#e5c158]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Wood Texture Grid Lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5c158_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Organizer Unit Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a1a12]/80 border border-[#e5c158]/40 shadow-xl backdrop-blur-md mb-6 animate-float">
          <Cross className="w-4 h-4 text-[#e5c158]" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#f4ece1]/90">
            {EVENT_DETAILS.organizer}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d96b27]" />
          <span className="text-xs font-garamond italic text-[#e5c158]">Presents</span>
        </div>

        {/* Main EDESSA Typography */}
        <div className="relative mb-2">
          <h1 className="font-cinzel text-6xl sm:text-8xl md:text-9xl font-black tracking-widest leading-none text-gold-gradient drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            EDESSA
          </h1>
          {/* Subtle Christian Cross accent over title */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-30 text-[#e5c158]">
            <Cross className="w-12 h-12" />
          </div>
        </div>

        {/* Tagline "Called to Witness" */}
        <div className="mb-8">
          <h2 className="font-script text-4xl sm:text-6xl md:text-7xl text-orange-gradient drop-shadow-md">
            Called to Witness
          </h2>
          <p className="mt-2 text-sm sm:text-lg font-light text-[#f4ece1]/80 max-w-2xl mx-auto tracking-wide">
            Join hundreds of vibrant youth for an unforgettable day of spiritual renewal, cultural joy, and unity.
          </p>
        </div>

        {/* Event Key Info Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10">
          
          {/* Date Card */}
          <div className="bg-wood-card p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Date & Day</p>
              <p className="text-sm font-semibold text-white">{EVENT_DETAILS.date}</p>
              <p className="text-xs text-[#f4ece1]/70">{EVENT_DETAILS.day}</p>
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-wood-card p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Timings</p>
              <p className="text-sm font-semibold text-white">10:00 AM Onwards</p>
              <p className="text-xs text-[#f4ece1]/70">Full Day Event</p>
            </div>
          </div>

          {/* Venue Card */}
          <div className="bg-wood-card p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group sm:col-span-1">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Venue</p>
              <p className="text-xs font-semibold text-white line-clamp-1">{EVENT_DETAILS.venue}</p>
              <p className="text-xs text-[#f4ece1]/70">Chemmalamattom</p>
            </div>
          </div>

        </div>

        {/* Live Countdown Timer Section */}
        <div className="max-w-2xl mx-auto mb-10 p-6 rounded-3xl bg-wood-card border-2 border-[#d4af37]/30 shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d96b27] text-white text-[11px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffe8aa]" />
            Event Countdown
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full py-3 sm:py-4 rounded-2xl bg-[#1a0f0a] border border-[#e5c158]/20 flex items-center justify-center shadow-inner">
                  <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-black text-gold-gradient">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#f4ece1]/70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-gradient font-extrabold text-base text-white shadow-xl shadow-[#d96b27]/40 hover:shadow-[#d96b27]/60 hover:scale-105 active:scale-95 transition-all border border-[#e5c158]/60 flex items-center justify-center gap-3 group"
          >
            <span>Register Now • ₹100</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#schedule"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#2a1a12] hover:bg-[#382015] text-[#e5c158] font-bold text-base border border-[#d4af37]/40 transition-all flex items-center justify-center gap-2"
          >
            View Event Schedule
          </a>
        </div>

      </div>

      {/* Organic Curved Wave Divider at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf5ee] to-transparent pointer-events-none opacity-10" />
    </section>
  );
}
