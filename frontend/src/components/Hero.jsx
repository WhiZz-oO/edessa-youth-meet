import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { EVENT_DETAILS } from "../data/mockData";
import heroBg from "../assets/hero_christian_bg.jpg";

export default function Hero({ onOpenRegister }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.targetDateStr).getTime();
    const calculateTimeLeft = () => {
      const diff = targetDate - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604]/80 via-[#150d09]/75 to-[#150d09]/95 pointer-events-none" />

      {/* Gold dot grid overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5c158_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Organizer Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e130d]/90 border border-[#e5c158]/50 shadow-xl backdrop-blur-md mb-6 animate-float">
          <span className="text-[#e5c158] text-lg">✝</span>
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#f4ece1]/90">
            {EVENT_DETAILS.organizer}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d96b27]" />
          <span className="text-xs font-garamond italic text-[#e5c158]">Presents</span>
        </div>

        {/* EDESSA Title */}
        <h1 className="font-cinzel text-6xl sm:text-8xl md:text-9xl font-black tracking-widest leading-none text-gold-gradient drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] mb-2">
          EDESSA
        </h1>
          <br></br>
        {/* Called to Witness */}
        <div className="mb-4">
          <h2 className="font-script text-4xl sm:text-6xl md:text-7xl text-orange-gradient drop-shadow-md">
            Called to Witness
          </h2>
        </div>

        {/* Scripture Reference */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d96b27]/20 border border-[#d96b27]/50 backdrop-blur-md mb-6">
          <BookOpen className="w-4 h-4 text-[#e5c158]" />
          <span className="font-garamond italic text-base sm:text-lg text-[#f4ece1] tracking-widest">
            "{EVENT_DETAILS.tagline}" &mdash; <strong className="text-[#e5c158]">{EVENT_DETAILS.scriptureRef}</strong>
          </span>
        </div>

        {/* Audience Note */}
        <p className="text-xs sm:text-sm text-[#ff9e58] font-bold uppercase tracking-widest mb-8 bg-[#1a0f0a]/60 inline-block px-4 py-1 rounded-full border border-[#d96b27]/40">
          ✦ {EVENT_DETAILS.audience} ✦
        </p>

        {/* Event Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10">
          <div className="bg-[#1a0f0a]/80 backdrop-blur p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Date & Day</p>
              <p className="text-sm font-semibold text-white">{EVENT_DETAILS.date}</p>
              <p className="text-xs text-[#f4ece1]/70">{EVENT_DETAILS.day}</p>
            </div>
          </div>
          <div className="bg-[#1a0f0a]/80 backdrop-blur p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Timings</p>
              <p className="text-sm font-semibold text-white">10:00 AM Onwards</p>
              <p className="text-xs text-[#f4ece1]/70">Full Day Event</p>
            </div>
          </div>
          <div className="bg-[#1a0f0a]/80 backdrop-blur p-4 rounded-2xl border border-[#d4af37]/20 flex items-center gap-3 text-left hover:border-[#d96b27]/50 transition-all shadow-lg group">
            <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#e5c158] font-bold">Venue</p>
              <p className="text-xs font-semibold text-white">12 Apostles Auditorium</p>
              <p className="text-xs text-[#f4ece1]/70">Chemmalamattom</p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-2xl mx-auto mb-10 p-6 rounded-3xl bg-[#1a0f0a]/80 backdrop-blur-md border-2 border-[#d4af37]/30 shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d96b27] text-white text-[11px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffe8aa]" />
            Event Countdown
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full py-3 sm:py-4 rounded-2xl bg-[#0f0804] border border-[#e5c158]/20 flex items-center justify-center shadow-inner">
                  <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-black text-gold-gradient">
                    {String(item.value).padStart(2, "0")}
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
          <a
            href="#schedule"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-gradient font-extrabold text-base text-white shadow-xl shadow-[#d96b27]/40 hover:shadow-[#d96b27]/60 hover:scale-105 active:scale-95 transition-all border border-[#e5c158]/60 flex items-center justify-center gap-3 group"
          >
            <span>View Programme</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#speakers"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#1a0f0a]/80 backdrop-blur hover:bg-[#382015] text-[#e5c158] font-bold text-base border border-[#d4af37]/40 transition-all flex items-center justify-center gap-2"
          >
            ✝ Meet Resource Persons
          </a>
        </div>

      </div>
    </section>
  );
}
