import React from 'react';
import { X, CheckCircle, Printer, Cross, Sparkles, MapPin, Calendar, Banknote, CreditCard, Home, User } from 'lucide-react';

export default function TicketModal({ ticketData, onClose }) {
  if (!ticketData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCash = ticketData.paymentMode === 'Spot Cash' || ticketData.paymentMode === 'cash';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative max-w-xl w-full bg-wood-card rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden my-8 text-white">
        
        {/* Top Celebration Banner */}
        <div className="bg-orange-gradient p-4 text-center border-b border-[#e5c158]/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffe8aa]" />
            <span className="font-cinzel text-sm font-bold tracking-wider uppercase">
              Official Delegate Ticket Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Inner Card */}
        <div className="p-6 sm:p-8 space-y-6" id="printable-ticket">
          
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-[#382015] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cross className="w-5 h-5 text-[#e5c158]" />
                <h3 className="font-cinzel text-2xl font-black text-gold-gradient tracking-widest">
                  EDESSA 2026
                </h3>
              </div>
              <p className="font-garamond italic text-xs text-[#e5c158] mt-0.5">
                Called to Witness • SMYM Chemmalamattom
              </p>
            </div>

            <div className="text-right">
              {isCash ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                  <Banknote className="w-3 h-3" />
                  Spot Cash (Pay at Desk)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-green-500/20 text-green-400 border border-green-500/40 inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  GPay Verified
                </span>
              )}
              <p className="text-[10px] font-mono text-[#f4ece1]/60 mt-1">
                Pass ID: <span className="text-white font-bold">{ticketData.ticketId}</span>
              </p>
            </div>
          </div>

          {/* Delegate Information */}
          <div className="grid grid-cols-2 gap-4 bg-[#1a0f0a] p-4 rounded-2xl border border-[#d4af37]/20">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">Delegate Name</p>
              <p className="text-base font-bold text-white mt-0.5">{ticketData.fullName}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">House Name</p>
              <p className="text-sm font-semibold text-white mt-0.5">{ticketData.houseName || '—'}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">Ward Number</p>
              <p className="text-sm font-semibold text-[#f4ece1] mt-0.5">{ticketData.parish}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">Phone Number</p>
              <p className="text-xs font-mono text-[#f4ece1] mt-0.5">{ticketData.phone}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-[#382015]">
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">Age & Email</p>
              <p className="text-xs text-[#f4ece1] mt-0.5">{ticketData.age} yrs • {ticketData.email}</p>
            </div>
          </div>

          {/* QR Code & Venue Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#231610] border border-[#d4af37]/20">
            
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#e5c158] font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>25 August 2026 • Tuesday (10:00 AM)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#f4ece1]/80">
                <MapPin className="w-3.5 h-3.5 text-[#d96b27]" />
                <span>12 Apostles Auditorium, Chemmalamattom</span>
              </div>
              <p className="text-[10px] text-[#ff9e58] font-medium flex items-center gap-1">
                {isCash ? (
                  <span>💵 Payment: ₹150 (Pay in cash at registration counter)</span>
                ) : (
                  <span>💳 GPay Ref: #{ticketData.txnRef}</span>
                )}
              </p>
            </div>

            {/* Styled Gate Pass Box */}
            <div className="p-2 bg-white rounded-xl shadow-lg border border-[#e5c158] flex flex-col items-center flex-shrink-0">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff" />
                <rect x="10" y="10" width="25" height="25" fill="#150d09" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#d96b27" />
                
                <rect x="65" y="10" width="25" height="25" fill="#150d09" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#d96b27" />
                
                <rect x="10" y="65" width="25" height="25" fill="#150d09" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#d96b27" />
                
                <rect x="45" y="45" width="10" height="10" fill="#150d09" />
                <rect x="60" y="60" width="15" height="15" fill="#d96b27" />
                <rect x="75" y="75" width="10" height="10" fill="#150d09" />
                <rect x="45" y="75" width="12" height="12" fill="#d4af37" />
                <rect x="75" y="45" width="12" height="12" fill="#150d09" />
              </svg>
              <span className="text-[8px] font-mono font-bold text-[#150d09] uppercase tracking-wider mt-1">
                GATE PASS
              </span>
            </div>

          </div>

          <p className="text-[10px] text-center text-[#f4ece1]/60 italic font-garamond text-xs">
            * Please present this digital ticket or printed pass at the 12 Apostles Auditorium registration desk upon arrival.
          </p>

        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#1a0f0a] border-t border-[#382015] flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#2a1a12] hover:bg-[#382015] text-[#e5c158] font-bold text-xs border border-[#d4af37]/40 transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-gradient hover:opacity-90 text-white font-bold text-xs transition-opacity flex items-center justify-center gap-2 border border-[#e5c158]/50"
          >
            Done & Close
          </button>
        </div>

      </div>

    </div>
  );
}
