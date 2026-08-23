import React from 'react';
import { 
  AlertCircle, Phone, MessageCircle, ShieldAlert, Calendar, MapPin, Clock
} from 'lucide-react';

export default function Registration() {
  return (
    <section id="register" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#140b07]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d96b27]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>Registration Closed</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-gold-gradient tracking-tight">
            Online Registration Stopped
          </h2>
          <p className="text-[#f4ece1]/80 text-sm sm:text-base max-w-xl mx-auto">
            Online registrations for EDESSA 2026 are officially closed as maximum delegate seating and team groupings have been finalized.
          </p>
        </div>

        {/* Big Alert Notice Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#1c120c] border-2 border-[#d4af37]/40 shadow-2xl space-y-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center mx-auto text-red-400 shadow-lg">
            <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              Need Late Admission or Assistance?
            </h3>
            <p className="text-sm sm:text-base text-[#f4ece1]/80 max-w-lg mx-auto leading-relaxed">
              If you have not registered yet and wish to attend, or for any urgent inquiries, please <strong>directly contact the SMYM President</strong>.
            </p>
          </div>

          {/* President Contact Card */}
          <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-[#140b07] border-2 border-[#e5c158]/50 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d96b27]">
                OFFICIAL CONTACT PERSON
              </span>
              <h4 className="text-lg sm:text-xl font-black text-[#e5c158] uppercase">
                SMYM President
              </h4>
              <p className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider pt-1">
                9207215221
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="tel:9207215221"
                className="py-3 px-4 rounded-xl bg-orange-gradient hover:brightness-110 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md border border-[#e5c158]/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call President</span>
              </a>

              <a
                href="https://wa.me/919207215221?text=Hi%20President%2C%20regarding%20EDESSA%202026%20late%20registration"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md border border-emerald-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Message</span>
              </a>
            </div>
          </div>

          {/* Event Venue & Date Reminder */}
          <div className="pt-4 border-t border-[#382015] flex flex-wrap items-center justify-center gap-6 text-xs text-[#f4ece1]/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#d96b27]" />
              <span>25 August 2026 • Tuesday</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#d96b27]" />
              <span>10:00 AM Onwards</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#d96b27]" />
              <span>12 Apostles Auditorium, Chemmalamattom</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
