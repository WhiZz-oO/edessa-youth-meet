import React, { useRef, useState, useEffect } from 'react';
import { X, CheckCircle, Cross, Sparkles, MapPin, Calendar, Banknote, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

export default function TicketModal({ ticketData, onClose }) {
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  if (!ticketData) return null;

  const isCash = ticketData.paymentMode === 'Spot Cash' || ticketData.paymentMode === 'cash';

  useEffect(() => {
    if (ticketData?.ticketId) {
      // Build unique check-in payload URL encoded in the QR code
      const qrPayload = `${ticketData.ticketId || ''}|${ticketData.fullName || ''}|${ticketData.parish || ''}|${ticketData.houseName || ''}|${ticketData.phone || ''}|${isCash ? 'cash' : 'online'}`;
      QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 1,
        color: {
          dark: '#150d09',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [ticketData, isCash]);

  const handleDownloadPng = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 3, // High-res 3x crisp image
        backgroundColor: '#1c120c',
      });

      const link = document.createElement('a');
      const safeName = (ticketData.fullName || 'Delegate').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${ticketData.ticketId || 'EDESSA-2026'}_${safeName}_Pass.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate PNG:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative max-w-xl w-full bg-[#1c120c] rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden my-6 text-white">
        
        {/* Top Celebration Banner */}
        <div className="bg-orange-gradient p-3.5 text-center border-b border-[#e5c158]/50 flex items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffe8aa]" />
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase">
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

        {/* Printable Pass Inner Card (Captured for PNG Download) */}
        <div className="p-5 sm:p-7 space-y-5 bg-[#1c120c]" ref={ticketRef} id="printable-ticket">
          
          {/* Header Branding */}
          <div className="flex justify-between items-start border-b border-[#382015] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Cross className="w-5 h-5 text-[#e5c158]" />
                <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-gradient tracking-widest">
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
                  Online Verified
                </span>
              )}
              <p className="text-[10px] font-mono text-[#f4ece1]/70 mt-1">
                Pass ID: <span className="text-white font-bold">{ticketData.ticketId}</span>
              </p>
            </div>
          </div>

          {/* Delegate Information Card */}
          <div className="grid grid-cols-2 gap-3.5 bg-[#140b07] p-4 rounded-2xl border border-[#d4af37]/30">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#e5c158]">Delegate Name</p>
              <p className="text-base sm:text-lg font-bold text-white mt-0.5">{ticketData.fullName}</p>
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
              <p className="text-xs font-mono text-[#f4ece1] mt-0.5">{ticketData.phone || '—'}</p>
            </div>

            <div className="col-span-2 pt-2 border-t border-[#382015] flex items-center justify-between text-xs text-[#f4ece1]/80 flex-wrap gap-2">
              <span><strong>Age:</strong> {ticketData.age || '—'} yrs</span>
              {ticketData.studentClass && (
                <span className="text-amber-300 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {ticketData.studentClass.startsWith('Class') ? '🎓 ' + ticketData.studentClass : (ticketData.studentClass === 'Parish Youth' ? '🌟 Parish Youth' : '🎓 Class ' + ticketData.studentClass)}
                </span>
              )}
              {ticketData.email && ticketData.email !== '—' && <span className="truncate max-w-[160px]"><strong>Email:</strong> {ticketData.email}</span>}
            </div>
          </div>

          {/* Venue Details & Real Unique Gate Pass QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#231610] border border-[#d4af37]/20">
            
            <div className="space-y-1 text-center sm:text-left text-xs">
              <div className="flex items-center gap-1.5 text-[#e5c158] font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#d96b27]" />
                <span>25 August 2026 • Tuesday (10:00 AM)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#f4ece1]/85 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#d96b27]" />
                <span>12 Apostles Auditorium, Chemmalamattom</span>
              </div>
              <p className="text-[11px] text-[#ff9e58] font-medium pt-0.5">
                {isCash ? (
                  <span>💵 Fee: ₹150 (Pay in cash at registration counter)</span>
                ) : (
                  <span>💳 Online Payment Verified</span>
                )}
              </p>
            </div>

            {/* Real Unique Scannable QR Code */}
            <div className="p-2 bg-white rounded-2xl shadow-xl border-2 border-[#e5c158] flex flex-col items-center flex-shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Check-in Pass for ${ticketData.ticketId}`}
                  className="w-24 h-24 object-contain rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#d96b27]" />
                </div>
              )}
              <span className="text-[8px] font-mono font-black text-[#150d09] uppercase tracking-widest mt-1">
                SCAN FOR CHECK-IN
              </span>
            </div>

          </div>

          <p className="text-[10px] text-center text-[#f4ece1]/60 italic font-garamond">
            * Please present this digital ticket pass at the 12 Apostles Auditorium registration desk upon arrival.
          </p>

        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#140b07] border-t border-[#382015] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 rounded-xl bg-orange-gradient hover:opacity-95 text-white font-extrabold text-xs sm:text-sm border border-[#e5c158]/50 shadow-lg shadow-[#d96b27]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PNG Image...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Ticket (PNG Image)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-[#2a1a12] hover:bg-[#382015] text-[#f4ece1] font-bold text-xs border border-[#d4af37]/30 transition-colors"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
}
