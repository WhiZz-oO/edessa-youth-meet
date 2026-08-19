import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, User, Home, MapPin, Phone, Banknote, ShieldCheck, Loader2, Sparkles, X, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';

export default function CheckInModal({ checkinData, onClose }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkinTime, setCheckinTime] = useState('');
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    if (checkinData?.ticketId) {
      // Check local attendance record
      const attendance = JSON.parse(localStorage.getItem('edessa_attendance') || '{}');
      if (attendance[checkinData.ticketId]) {
        setAlreadyCheckedIn(true);
        setCheckinTime(attendance[checkinData.ticketId]);
      }
    }
  }, [checkinData]);

  if (!checkinData) return null;

  const handleConfirmCheckin = async () => {
    setIsSubmitting(true);
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const checkinPayload = {
      action: 'checkin',
      ticketId: checkinData.ticketId,
      fullName: checkinData.fullName,
      time: nowTime,
    };

    // Save to Google Sheets
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(checkinPayload),
        });
      } catch (err) {
        console.warn('Checkin sheet update:', err);
      }
    }

    // Save locally
    const attendance = JSON.parse(localStorage.getItem('edessa_attendance') || '{}');
    attendance[checkinData.ticketId] = nowTime;
    localStorage.setItem('edessa_attendance', JSON.stringify(attendance));

    setIsSubmitting(false);
    setIsCheckedIn(true);
    setCheckinTime(nowTime);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const isCash = checkinData.paymentMode === 'Spot Cash' || checkinData.paymentMode === 'cash';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative max-w-md w-full bg-[#1c120c] rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden my-6 text-white">
        
        {/* Header */}
        <div className="bg-orange-gradient p-4 text-center border-b border-[#e5c158]/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffe8aa]" />
            <span className="font-cinzel text-sm font-bold tracking-wider uppercase">
              Delegate Check-In Scanner
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Status Alert Banner */}
          {alreadyCheckedIn ? (
            <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-300">Already Checked In!</p>
                <p className="text-[11px] text-[#f4ece1]/80 mt-0.5">
                  This delegate was checked in at <strong>{checkinTime}</strong>.
                </p>
              </div>
            </div>
          ) : isCheckedIn ? (
            <div className="p-4 rounded-2xl bg-green-500/20 border-2 border-green-500 text-green-300 text-xs flex items-start gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-green-400 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-green-300">Check-In Successful! 🎉</p>
                <p className="text-[11px] text-[#f4ece1]/90 mt-0.5">
                  Marked as <strong>PRESENT</strong> at {checkinTime}. Hand over the delegate badge & welcome kit!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-400" />
              <span>QR Code Verified • Ready to Check-In</span>
            </div>
          )}

          {/* Delegate Details */}
          <div className="bg-[#140b07] p-5 rounded-2xl border border-[#d4af37]/30 space-y-3.5">
            <div className="border-b border-[#382015] pb-3 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#e5c158]">Delegate Name</p>
                <h3 className="text-xl font-bold text-white mt-0.5">{checkinData.fullName}</h3>
              </div>
              <span className="font-mono text-xs font-bold text-[#e5c158] bg-[#2a1a12] px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                {checkinData.ticketId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[#f4ece1]/60 text-[10px] uppercase font-semibold">House Name</p>
                <p className="font-bold text-white mt-0.5">{checkinData.houseName || '—'}</p>
              </div>

              <div>
                <p className="text-[#f4ece1]/60 text-[10px] uppercase font-semibold">Ward Number</p>
                <p className="font-bold text-[#e5c158] mt-0.5">{checkinData.parish}</p>
              </div>

              <div>
                <p className="text-[#f4ece1]/60 text-[10px] uppercase font-semibold">Phone Number</p>
                <p className="font-mono font-medium text-white mt-0.5">{checkinData.phone || '—'}</p>
              </div>

              <div>
                <p className="text-[#f4ece1]/60 text-[10px] uppercase font-semibold">Payment Status</p>
                {isCash ? (
                  <p className="font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                    <Banknote className="w-3.5 h-3.5" />
                    Collect ₹150 Cash
                  </p>
                ) : (
                  <p className="font-bold text-green-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid Online
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {!alreadyCheckedIn && !isCheckedIn ? (
              <button
                type="button"
                onClick={handleConfirmCheckin}
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-2xl bg-green-600 hover:bg-green-500 active:scale-95 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-900/40 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Recording Attendance...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm &amp; Mark as Present (Check In)</span>
                  </>
                )}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#2a1a12] hover:bg-[#382015] text-[#f4ece1] font-bold text-xs border border-[#d4af37]/30 transition-colors"
            >
              Close Window
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
