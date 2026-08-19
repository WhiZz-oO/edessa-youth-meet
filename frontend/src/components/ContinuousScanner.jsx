import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  CheckCircle2, AlertTriangle, Camera, X, Volume2, VolumeX, 
  Users, Banknote, Search, RefreshCw, Sparkles, ShieldCheck, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';

export default function ContinuousScanner({ onClose }) {
  const [scannedList, setScannedList] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // 'success' | 'duplicate' | 'scanning'
  const [cameraError, setCameraError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const scannerRef = useRef(null);
  const lastScannedCodeRef = useRef('');
  const lastScannedTimeRef = useRef(0);

  // Load existing attendance on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('edessa_attendance_list') || '[]');
    setScannedList(saved);
  }, []);

  // Audio Beep Effect
  const playBeep = (isSuccess) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (isSuccess) {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio feedback error', e);
    }
  };

  // Start continuous camera
  useEffect(() => {
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('continuous-qr-reader');
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          handleScanSuccess,
          () => {} // Frame error silent
        );
        setIsCameraActive(true);
      } catch (err) {
        console.error('Camera start error:', err);
        setCameraError('Camera access required. Please allow camera permissions in your browser.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch (e) {}
      }
    };
  }, []);

  const handleScanSuccess = (decodedText) => {
    const now = Date.now();
    // Debounce scan of same QR within 2.5 seconds to prevent spamming
    if (decodedText === lastScannedCodeRef.current && now - lastScannedTimeRef.current < 2500) {
      return;
    }
    lastScannedCodeRef.current = decodedText;
    lastScannedTimeRef.current = now;

    processDelegateCheckIn(decodedText);
  };

  const processDelegateCheckIn = async (codeText) => {
    let ticketId = '';
    let fullName = 'Delegate';
    let houseName = '—';
    let parish = 'Ward';
    let phone = '—';
    let paymentMode = 'Spot Cash';

    // Parse piped format: EDESSA-2026-6224|Albin Mathews|Ward 13|Kocheettathottu|9207215221|cash
    if (codeText.includes('|')) {
      const parts = codeText.split('|');
      ticketId = parts[0] || 'EDESSA-PASS';
      fullName = parts[1] || 'Delegate';
      parish = parts[2] || 'Ward';
      houseName = parts[3] || '—';
      phone = parts[4] || '—';
      paymentMode = parts[5] === 'online' ? 'Google Pay (UPI)' : 'Spot Cash';
    } else if (codeText.includes('ticket=') || codeText.includes('checkin=')) {
      // URL formatted
      try {
        const url = new URL(codeText);
        const params = new URLSearchParams(url.search);
        ticketId = params.get('ticket') || params.get('checkin') || 'EDESSA-PASS';
        fullName = params.get('name') || 'Delegate';
        houseName = params.get('house') || '—';
        parish = params.get('ward') || 'Ward';
        phone = params.get('phone') || '—';
        paymentMode = params.get('pay') === 'online' ? 'Google Pay (UPI)' : 'Spot Cash';
      } catch (e) {
        ticketId = codeText.trim();
      }
    } else {
      ticketId = codeText.trim();
    }

    const checkinTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Check if already checked in
    const currentAttendance = JSON.parse(localStorage.getItem('edessa_attendance_list') || '[]');
    const existing = currentAttendance.find(item => item.ticketId === ticketId);

    if (existing) {
      // DUPLICATE DETECTED
      playBeep(false);
      setScanStatus('duplicate');
      setLatestScan({
        ticketId,
        fullName: existing.fullName || fullName,
        houseName: existing.houseName || houseName,
        parish: existing.parish || parish,
        paymentMode: existing.paymentMode || paymentMode,
        firstCheckedInAt: existing.time,
        checkinTime: checkinTime,
      });
      return;
    }

    // SUCCESS - RECORD CHECK-IN
    playBeep(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });

    const newRecord = {
      ticketId,
      fullName,
      houseName,
      parish,
      phone,
      paymentMode,
      time: checkinTime,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    const updatedList = [newRecord, ...currentAttendance];
    setScannedList(updatedList);
    localStorage.setItem('edessa_attendance_list', JSON.stringify(updatedList));

    setScanStatus('success');
    setLatestScan(newRecord);

    // Sync to Google Sheets in background
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'checkin',
            ticketId: ticketId,
            fullName: fullName,
            time: checkinTime,
          }),
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleManualSearchCheckin = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    processDelegateCheckIn(searchQuery.trim());
    setSearchQuery('');
  };

  // Filter list by search query
  const filteredList = scannedList.filter(item => 
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.parish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0705] text-white flex flex-col overflow-hidden">
      
      {/* Top Admin Navbar */}
      <header className="bg-[#1c120c] border-b border-[#d4af37]/30 px-4 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center font-bold text-white shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-gold-gradient tracking-wide">
              EDESSA 2026 • Scanner Desk
            </h2>
            <p className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Continuous Camera Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#2a1a12] border border-[#d4af37]/30 text-[#e5c158] hover:bg-[#3d2417] text-xs font-bold transition-all"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Close Scanner */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Desk</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Left Scanner / Right Live Attendance Feed */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Live Camera & Instant Status Banner */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto border-r border-[#382015]">
          
          {/* Camera Viewfinder Box */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#e5c158] bg-black shadow-2xl p-1">
            <div id="continuous-qr-reader" className="w-full h-64 sm:h-72 bg-black rounded-2xl overflow-hidden"></div>
            
            {/* Guide overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
              <div className="w-48 h-48 border-2 border-dashed border-[#e5c158]/70 rounded-2xl animate-pulse"></div>
              <p className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
                Aim at participant's QR code
              </p>
            </div>
          </div>

          {cameraError && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500 text-red-200 text-xs text-center font-medium">
              {cameraError}
            </div>
          )}

          {/* Instant Scan Result Notification Card */}
          {latestScan && (
            <div className={`p-4 rounded-2xl border-2 shadow-2xl transition-all animate-in zoom-in-95 ${
              scanStatus === 'success'
                ? 'bg-green-500/20 border-green-500 text-white'
                : 'bg-red-500/25 border-red-500 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  {scanStatus === 'success' ? (
                    <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-7 h-7 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40">
                      {scanStatus === 'success' ? '✅ CHECKED IN PRESENT' : '⚠️ ALREADY CHECKED IN'}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      {latestScan.fullName}
                    </h3>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-[#e5c158] bg-black/50 px-2.5 py-1 rounded-lg">
                  {latestScan.ticketId}
                </span>
              </div>

              {/* Delegate quick meta */}
              <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-white/70 text-[10px] uppercase">Ward / House</span>
                  <p className="font-bold text-white">{latestScan.parish} • {latestScan.houseName}</p>
                </div>

                <div>
                  <span className="text-white/70 text-[10px] uppercase">Fee Action</span>
                  {latestScan.paymentMode === 'Spot Cash' ? (
                    <p className="font-extrabold text-amber-300 flex items-center gap-1">
                      <Banknote className="w-4 h-4" /> Collect ₹150 Cash
                    </p>
                  ) : (
                    <p className="font-extrabold text-green-400">
                      ✅ Online Verified
                    </p>
                  )}
                </div>
              </div>

              {scanStatus === 'duplicate' && (
                <p className="mt-2 text-[11px] text-red-200 font-semibold bg-black/40 p-2 rounded-lg">
                  ⛔ Warning: This pass was already checked in at <strong>{latestScan.firstCheckedInAt}</strong>. Check delegate identity!
                </p>
              )}
            </div>
          )}

          {/* Manual ID Search Entry */}
          <form onSubmit={handleManualSearchCheckin} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Or type Name / Ticket ID (e.g. 6224)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c120c] border border-[#d4af37]/40 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d96b27]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-orange-gradient text-white font-bold text-xs shadow-md border border-[#e5c158]/50 active:scale-95 transition-all"
            >
              Check In
            </button>
          </form>

        </div>

        {/* Right Column: Live Desk Attendance Roster */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col overflow-hidden bg-[#140b07]">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#1c120c] p-3.5 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#e5c158]">Total Present</p>
                <p className="text-2xl font-black text-white">{scannedList.length}</p>
              </div>
              <Users className="w-7 h-7 text-[#e5c158]" />
            </div>

            <div className="bg-[#1c120c] p-3.5 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#e5c158]">Spot Cash Collected</p>
                <p className="text-2xl font-black text-amber-400">
                  ₹{scannedList.filter(i => i.paymentMode === 'Spot Cash').length * 150}
                </p>
              </div>
              <Banknote className="w-7 h-7 text-amber-400" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h4 className="font-cinzel text-xs font-bold text-[#e5c158] uppercase tracking-wider">
              Live Attendance Feed ({scannedList.length} Checked In)
            </h4>
            <span className="text-[10px] text-[#f4ece1]/60">Auto-saved to Google Sheets</span>
          </div>

          {/* List of Scanned Attendees */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {scannedList.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs space-y-2">
                <Camera className="w-8 h-8 mx-auto text-gray-600 animate-bounce" />
                <p>Scanner is active and ready!</p>
                <p className="text-[10px]">Aim at any ticket QR code to mark them present.</p>
              </div>
            ) : (
              filteredList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1c120c] border border-[#382015] hover:border-[#d4af37]/40 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.fullName}</span>
                      <span className="text-[10px] font-mono text-[#e5c158] bg-[#2a1a12] px-1.5 py-0.2 rounded border border-[#d4af37]/20">
                        {item.ticketId}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#f4ece1]/70">
                      {item.parish} • {item.houseName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      {item.time}
                    </span>
                    <p className="text-[10px] font-medium text-amber-300 mt-1">
                      {item.paymentMode === 'Spot Cash' ? '💵 ₹150 Cash' : '✅ Online'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
