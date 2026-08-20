import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  CheckCircle2, AlertTriangle, Camera, X, Volume2, VolumeX, 
  Users, Banknote, Search, RefreshCw, Sparkles, ShieldCheck, Zap,
  UserCheck, UserX, Award, Filter, ChevronRight, Clock, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';

const VOLUNTEERS = [
  { id: 'dona', name: 'Dona George' },
  { id: 'neha', name: 'Neha Miriam Jose' },
];

export default function ContinuousScanner({ onClose }) {
  // Current active volunteer on this device
  const [activeVolunteer, setActiveVolunteer] = useState(() => {
    return localStorage.getItem('edessa_active_volunteer') || 'Dona George';
  });

  // Mode: 'scanner' (Desk Camera Mode) | 'admin' (Super Admin Breakdown Dashboard)
  const [viewTab, setViewTab] = useState('scanner');

  // Master database from Google Sheets
  const [allDelegates, setAllDelegates] = useState([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('');

  // Scanner state
  const [pendingScan, setPendingScan] = useState(null); // Delegate waiting for cash confirmation
  const [scanStatus, setScanStatus] = useState(null); // 'pending_confirm' | 'success' | 'duplicate'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin filter
  const [adminFilter, setAdminFilter] = useState('all'); // 'all' | 'present' | 'pending' | 'dona' | 'neha'

  const scannerRef = useRef(null);
  const lastScannedCodeRef = useRef('');
  const lastScannedTimeRef = useRef(0);

  // 1. Fetch Live Database from Google Sheet
  const fetchLiveSheetData = async () => {
    setIsLoadingSheet(true);
    const sheetGvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.sheetId}/gviz/tq?tqx=out:json&t=${Date.now()}`;
    
    try {
      const res = await fetch(sheetGvizUrl);
      const text = await res.text();
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const parsed = JSON.parse(jsonStr);

      if (parsed && parsed.table && Array.isArray(parsed.table.rows)) {
        const delegates = parsed.table.rows.map((r, idx) => {
          const c = r.c || [];
          const ticketId = c[0] ? String(c[0].v || '').trim() : '';
          const fullName = c[1] ? String(c[1].v || '').trim() : '';
          const houseName = c[2] ? String(c[2].v || '').trim() : '—';
          const phone = c[3] ? String(c[3].v || '').trim() : '';
          const parish = c[4] ? String(c[4].v || '').trim() : 'Ward';
          const age = c[5] ? String(c[5].v || '').trim() : '';
          const email = c[6] ? String(c[6].v || '').trim() : '';
          const paymentMode = c[7] ? String(c[7].v || '').trim() : 'Spot Cash';
          const txnRef = c[8] ? String(c[8].v || '').trim() : 'SPOT-CASH';
          const attendanceRaw = c[11] ? String(c[11].v || '').trim() : '';

          const isPresent = attendanceRaw.toUpperCase().includes('PRESENT');
          
          // Parse volunteer name if recorded (e.g. "PRESENT (10:15 am • Dona George)" or "by Dona George")
          let checkedInBy = '';
          let checkedInTime = '';
          if (isPresent) {
            if (attendanceRaw.includes('Dona George') || attendanceRaw.includes('Dona')) {
              checkedInBy = 'Dona George';
            } else if (attendanceRaw.includes('Neha Miriam') || attendanceRaw.includes('Neha')) {
              checkedInBy = 'Neha Miriam Jose';
            } else {
              checkedInBy = 'Registration Desk';
            }

            // Extract time inside parenthesis
            const match = attendanceRaw.match(/\((.*?)\)/);
            checkedInTime = match ? match[1].replace(/by.*|•.*/i, '').trim() : 'Checked In';
          }

          const isCash = !paymentMode.toLowerCase().includes('gpay') && 
                         !paymentMode.toLowerCase().includes('upi') && 
                         !paymentMode.toLowerCase().includes('google');

          return {
            rowId: idx + 2,
            ticketId,
            fullName,
            houseName,
            phone,
            parish,
            age,
            email,
            paymentMode: isCash ? 'Spot Cash' : 'Google Pay (UPI)',
            isCash,
            isPresent,
            attendanceRaw,
            checkedInBy,
            checkedInTime,
          };
        }).filter(d => d.ticketId && d.fullName);

        setAllDelegates(delegates);
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    } catch (err) {
      console.warn('Sheet live sync warning:', err);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  // Poll Google Sheets every 8 seconds for multi-device sync
  useEffect(() => {
    fetchLiveSheetData();
    const interval = setInterval(fetchLiveSheetData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleVolunteerChange = (name) => {
    setActiveVolunteer(name);
    localStorage.setItem('edessa_active_volunteer', name);
  };

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
    } catch (e) {}
  };

  // Start continuous camera when in 'scanner' tab
  useEffect(() => {
    if (viewTab !== 'scanner') return;

    let html5QrCode = null;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('continuous-qr-reader');
        scannerRef.current = html5QrCode;

        const config = {
          fps: 20,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.85);
            return {
              width: Math.max(260, edgeSize),
              height: Math.max(260, edgeSize)
            };
          },
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          handleScanSuccess,
          () => {}
        );
      } catch (err) {
        console.error('Camera start error:', err);
        setCameraError('Camera access required. Please allow camera permissions in browser.');
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
  }, [viewTab]);

  const handleScanSuccess = (decodedText) => {
    const now = Date.now();
    if (decodedText === lastScannedCodeRef.current && now - lastScannedTimeRef.current < 2500) {
      return;
    }
    lastScannedCodeRef.current = decodedText;
    lastScannedTimeRef.current = now;

    processScannedCode(decodedText);
  };

  const processScannedCode = (codeText) => {
    let ticketId = '';
    let fullName = '';
    let parish = '';
    let houseName = '';
    let phone = '';
    let paymentMode = 'Spot Cash';

    // Parse piped format: EDESSA-2026-6224|Albin Mathews|Ward 13|Kocheettathottu|9207215221|cash
    if (codeText.includes('|')) {
      const parts = codeText.split('|');
      ticketId = parts[0] ? parts[0].trim() : '';
      fullName = parts[1] ? parts[1].trim() : '';
      parish = parts[2] ? parts[2].trim() : '';
      houseName = parts[3] ? parts[3].trim() : '';
      phone = parts[4] ? parts[4].trim() : '';
      paymentMode = parts[5] === 'online' ? 'Google Pay (UPI)' : 'Spot Cash';
    } else if (codeText.includes('ticket=') || codeText.includes('checkin=')) {
      try {
        const url = new URL(codeText);
        const params = new URLSearchParams(url.search);
        ticketId = params.get('ticket') || params.get('checkin') || '';
        fullName = params.get('name') || '';
        houseName = params.get('house') || '';
        parish = params.get('ward') || '';
        phone = params.get('phone') || '';
        paymentMode = params.get('pay') === 'online' ? 'Google Pay (UPI)' : 'Spot Cash';
      } catch (e) {
        ticketId = codeText.trim();
      }
    } else {
      ticketId = codeText.trim();
    }

    // Match with master database from Google Sheet
    const matched = allDelegates.find(d => 
      (ticketId && d.ticketId.toUpperCase() === ticketId.toUpperCase()) ||
      (fullName && d.fullName.toLowerCase() === fullName.toLowerCase())
    );

    const delegateData = matched || {
      ticketId: ticketId || 'EDESSA-PASS',
      fullName: fullName || 'Delegate',
      houseName: houseName || '—',
      parish: parish || 'Ward',
      phone: phone || '—',
      paymentMode: paymentMode,
      isCash: paymentMode === 'Spot Cash',
      isPresent: false,
    };

    if (delegateData.isPresent) {
      // DUPLICATE ALREADY CHECKED IN
      playBeep(false);
      setScanStatus('duplicate');
      setPendingScan(delegateData);
    } else {
      // SHOW CASH CONFIRMATION PROMPT
      playBeep(true);
      setScanStatus('pending_confirm');
      setPendingScan(delegateData);
    }
  };

  // Confirm Check-in & Cash Collection
  const handleConfirmCheckin = async () => {
    if (!pendingScan) return;
    setIsSubmitting(true);

    const checkinTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedAttendance = `${checkinTime} • ${activeVolunteer}`;

    // Optimistic UI update immediately
    setAllDelegates(prev => prev.map(d => {
      if (d.ticketId === pendingScan.ticketId) {
        return {
          ...d,
          isPresent: true,
          checkedInBy: activeVolunteer,
          checkedInTime: checkinTime,
          attendanceRaw: `PRESENT (${formattedAttendance})`
        };
      }
      return d;
    }));

    setScanStatus('success');
    setPendingScan({
      ...pendingScan,
      isPresent: true,
      checkedInBy: activeVolunteer,
      checkedInTime: checkinTime,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Send to Google Sheets
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'checkin',
            ticketId: pendingScan.ticketId,
            fullName: pendingScan.fullName,
            time: formattedAttendance,
          }),
        });
      } catch (err) {
        console.warn('Checkin post warning:', err);
      }
    }

    setIsSubmitting(false);

    // Refresh master sheet in 1.5s
    setTimeout(fetchLiveSheetData, 1500);
  };

  const handleManualSearchCheckin = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Find in allDelegates
    const q = searchQuery.trim().toLowerCase();
    const matched = allDelegates.find(d => 
      d.ticketId.toLowerCase().includes(q) ||
      d.fullName.toLowerCase().includes(q) ||
      d.phone.includes(q)
    );

    if (matched) {
      processScannedCode(matched.ticketId);
    } else {
      processScannedCode(searchQuery.trim());
    }
    setSearchQuery('');
  };

  // Super Admin Stats
  const totalRegistered = allDelegates.length;
  const totalPresent = allDelegates.filter(d => d.isPresent).length;
  const totalPending = totalRegistered - totalPresent;
  const totalCashCollected = allDelegates.filter(d => d.isPresent && d.isCash).length * 150;
  const totalOnlinePaid = allDelegates.filter(d => d.isPresent && !d.isCash).length;

  // Volunteer Breakdown
  const donaCheckins = allDelegates.filter(d => d.isPresent && d.checkedInBy === 'Dona George');
  const donaCash = donaCheckins.filter(d => d.isCash).length * 150;

  const nehaCheckins = allDelegates.filter(d => d.isPresent && d.checkedInBy === 'Neha Miriam Jose');
  const nehaCash = nehaCheckins.filter(d => d.isCash).length * 150;

  const otherCheckins = allDelegates.filter(d => d.isPresent && d.checkedInBy !== 'Dona George' && d.checkedInBy !== 'Neha Miriam Jose');
  const otherCash = otherCheckins.filter(d => d.isCash).length * 150;

  // Filtered list for Admin Report
  const adminFilteredList = allDelegates.filter(item => {
    const matchSearch = 
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.parish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.houseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);

    if (!matchSearch) return false;

    if (adminFilter === 'present') return item.isPresent;
    if (adminFilter === 'pending') return !item.isPresent;
    if (adminFilter === 'dona') return item.isPresent && item.checkedInBy === 'Dona George';
    if (adminFilter === 'neha') return item.isPresent && item.checkedInBy === 'Neha Miriam Jose';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0705] text-white flex flex-col overflow-hidden">
      
      {/* Top Header Navigation */}
      <header className="bg-[#1c120c] border-b border-[#d4af37]/30 px-3.5 sm:px-6 py-2.5 flex items-center justify-between shadow-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center font-bold text-white shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-gold-gradient tracking-wide">
              EDESSA 2026 • Scanner Desk
            </h2>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Cloud Sync
              </span>
              {lastSyncTime && <span className="text-[#f4ece1]/50">• Synced {lastSyncTime}</span>}
            </div>
          </div>
        </div>

        {/* Top Controls: Volunteer Switcher & View Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Volunteer Selector */}
          <div className="flex items-center bg-[#140b07] p-1 rounded-xl border border-[#d4af37]/30 text-xs">
            <span className="text-[10px] text-[#f4ece1]/60 px-2 hidden sm:inline">Volunteer:</span>
            {VOLUNTEERS.map(v => (
              <button
                key={v.id}
                onClick={() => handleVolunteerChange(v.name)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeVolunteer === v.name
                    ? 'bg-orange-gradient text-white shadow-md'
                    : 'text-[#f4ece1]/70 hover:text-white'
                }`}
              >
                {v.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Mode Switch Tabs: Scanner / Super Admin Report */}
          <div className="flex bg-[#140b07] p-1 rounded-xl border border-[#d4af37]/30 text-xs">
            <button
              onClick={() => setViewTab('scanner')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewTab === 'scanner'
                  ? 'bg-[#d96b27] text-white shadow-md'
                  : 'text-[#f4ece1]/70 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan</span>
            </button>
            <button
              onClick={() => setViewTab('admin')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewTab === 'admin'
                  ? 'bg-[#d96b27] text-white shadow-md'
                  : 'text-[#f4ece1]/70 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Admin Report</span>
            </button>
          </div>

          {/* Manual Refresh */}
          <button
            onClick={fetchLiveSheetData}
            disabled={isLoadingSheet}
            className="p-2 rounded-xl bg-[#2a1a12] border border-[#d4af37]/30 text-[#e5c158] hover:bg-[#3d2417] text-xs font-bold transition-all cursor-pointer"
            title="Refresh Live Data from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? 'animate-spin text-[#d96b27]' : ''}`} />
          </button>

          {/* Close Scanner */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* TAB 1: SCANNER DESK VIEW */}
      {viewTab === 'scanner' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Fixed Non-Shrinking Camera + Cash Verification Action */}
          <div className="lg:col-span-6 p-3.5 sm:p-5 flex flex-col space-y-3 overflow-y-auto border-r border-[#382015]">
            
            {/* Active Volunteer Banner */}
            <div className="p-2.5 rounded-xl bg-[#1c120c] border border-[#d4af37]/30 flex items-center justify-between text-xs flex-shrink-0">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#e5c158]" />
                <span>Operating Desk: <strong className="text-[#e5c158]">{activeVolunteer}</strong></span>
              </div>
              <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                Ready to Scan
              </span>
            </div>

            {/* Rigid Fixed Height Camera Viewfinder (NEVER shrinks) */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#e5c158] bg-black shadow-2xl p-1 flex-shrink-0 w-full h-[320px] sm:h-[380px]">
              <div id="continuous-qr-reader" className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center"></div>
              
              {/* Guide overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-[#e5c158] rounded-3xl animate-pulse shadow-2xl"></div>
                <p className="text-[11px] font-bold text-white bg-black/70 px-3.5 py-1 rounded-full mt-3 backdrop-blur-md border border-[#e5c158]/30">
                  Aim at participant's QR code
                </p>
              </div>
            </div>

            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500 text-red-200 text-xs text-center font-medium flex-shrink-0">
                {cameraError}
              </div>
            )}

            {/* SCAN RESULT & CASH COLLECTION REMINDER ACTION CARD */}
            {pendingScan && (
              <div className={`p-4 rounded-2xl border-2 shadow-2xl transition-all animate-in zoom-in-95 flex-shrink-0 space-y-3 ${
                scanStatus === 'duplicate'
                  ? 'bg-red-500/20 border-red-500 text-white'
                  : scanStatus === 'success'
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-amber-500/15 border-2 border-amber-500 text-white'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {scanStatus === 'duplicate' ? (
                      <AlertTriangle className="w-7 h-7 text-red-400 flex-shrink-0" />
                    ) : scanStatus === 'success' ? (
                      <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0" />
                    ) : (
                      <Banknote className="w-7 h-7 text-amber-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40">
                        {scanStatus === 'duplicate'
                          ? '⚠️ ALREADY CHECKED IN'
                          : scanStatus === 'success'
                          ? '✅ CHECKED IN CONFIRMED'
                          : '⚡ VERIFY & COLLECT FEE'}
                      </span>
                      <h3 className="text-xl font-black text-white mt-1">
                        {pendingScan.fullName}
                      </h3>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#e5c158] bg-black/50 px-2.5 py-1 rounded-lg">
                    {pendingScan.ticketId}
                  </span>
                </div>

                {/* Delegate Details */}
                <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/70 text-[10px] uppercase">Ward / House</span>
                    <p className="font-bold text-white truncate">{pendingScan.parish} • {pendingScan.houseName}</p>
                  </div>

                  <div>
                    <span className="text-white/70 text-[10px] uppercase">Phone</span>
                    <p className="font-mono font-bold text-white">{pendingScan.phone || '—'}</p>
                  </div>
                </div>

                {/* Cash Collection Requirement Box */}
                {scanStatus === 'pending_confirm' && (
                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 space-y-2">
                    {pendingScan.isCash ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-amber-300">
                            💵 COLLECT ₹150 SPOT CASH
                          </p>
                          <p className="text-[10px] text-[#f4ece1]/80 mt-0.5">
                            Please collect ₹150 cash from delegate before confirming.
                          </p>
                        </div>
                        <span className="text-lg font-black text-amber-300 bg-black/40 px-3 py-1 rounded-xl">
                          ₹150
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Online Payment Verified (₹0 to collect)</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirmCheckin}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 active:scale-95 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {pendingScan.isCash
                          ? `✅ Confirm ₹150 Cash Received & Check In (by ${activeVolunteer})`
                          : `✅ Confirm Check-In & Hand Badge (by ${activeVolunteer})`}
                      </span>
                    </button>
                  </div>
                )}

                {scanStatus === 'duplicate' && (
                  <div className="p-2.5 rounded-xl bg-black/40 text-[11px] text-red-200 font-semibold space-y-1">
                    <p>⛔ <strong>Already Checked In</strong> at {pendingScan.checkedInTime || 'Earlier'} by {pendingScan.checkedInBy || 'Desk'}.</p>
                    <p className="text-[10px] text-white/70">Do not issue duplicate badge unless verified!</p>
                  </div>
                )}

                {scanStatus === 'success' && (
                  <div className="p-2.5 rounded-xl bg-green-500/20 text-green-300 text-xs font-bold flex items-center justify-between">
                    <span>Marked Present by {pendingScan.checkedInBy} at {pendingScan.checkedInTime}</span>
                    <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded">Ready for next</span>
                  </div>
                )}

              </div>
            )}

            {/* Manual ID / Name Search Entry */}
            <form onSubmit={handleManualSearchCheckin} className="flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Or type Name / Ticket ID / Phone"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c120c] border border-[#d4af37]/40 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d96b27]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-orange-gradient text-white font-bold text-xs shadow-md border border-[#e5c158]/50 active:scale-95 transition-all cursor-pointer"
              >
                Find &amp; Check In
              </button>
            </form>

          </div>

          {/* Right Column: Live Desk Attendance Feed (Synced across all phones) */}
          <div className="lg:col-span-6 p-3.5 sm:p-5 flex flex-col overflow-hidden bg-[#140b07]">
            
            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
              <div className="bg-[#1c120c] p-3 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#e5c158]">Total Present</p>
                  <p className="text-2xl font-black text-white">{totalPresent} <span className="text-xs text-gray-400 font-normal">/ {totalRegistered}</span></p>
                </div>
                <Users className="w-6 h-6 text-[#e5c158]" />
              </div>

              <div className="bg-[#1c120c] p-3 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#e5c158]">Cash Collected</p>
                  <p className="text-2xl font-black text-amber-400">₹{totalCashCollected}</p>
                </div>
                <Banknote className="w-6 h-6 text-amber-400" />
              </div>
            </div>

            {/* Volunteer Breakdown Quick Mini Cards */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0 text-xs">
              <div className="p-2.5 rounded-xl bg-[#1c120c] border border-blue-500/30">
                <p className="text-[10px] text-blue-400 font-bold">👩 Dona George</p>
                <p className="font-extrabold text-white mt-0.5">{donaCheckins.length} Present • <span className="text-amber-300">₹{donaCash}</span></p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1c120c] border border-purple-500/30">
                <p className="text-[10px] text-purple-400 font-bold">👩 Neha Miriam</p>
                <p className="font-extrabold text-white mt-0.5">{nehaCheckins.length} Present • <span className="text-amber-300">₹{nehaCash}</span></p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h4 className="font-cinzel text-xs font-bold text-[#e5c158] uppercase tracking-wider">
                Live Cloud Feed ({totalPresent} Checked In)
              </h4>
              <button
                onClick={fetchLiveSheetData}
                className="text-[10px] text-green-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Sync Now
              </button>
            </div>

            {/* Live Feed List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allDelegates.filter(d => d.isPresent).length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-gray-600 animate-bounce" />
                  <p>No delegates checked in yet today.</p>
                  <p className="text-[10px]">Aim camera at any QR code to begin check-in!</p>
                </div>
              ) : (
                allDelegates.filter(d => d.isPresent).map((item, idx) => (
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
                      <p className="text-[10px] text-blue-300 font-medium">
                        Admitted by: <strong>{item.checkedInBy || 'Desk'}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                        {item.checkedInTime}
                      </span>
                      <p className="text-[10px] font-bold text-amber-300 mt-1">
                        {item.isCash ? '💵 ₹150 Cash' : '✅ Online'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SUPER ADMIN BREAKDOWN REPORT */}
      {viewTab === 'admin' && (
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#140b07] space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#382015] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Master Administrative Report</span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-gold-gradient">
                EDESSA 2026 Live Attendance Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLiveSheetData}
                disabled={isLoadingSheet}
                className="px-4 py-2 rounded-xl bg-[#2a1a12] border border-[#d4af37]/40 text-[#e5c158] hover:bg-[#3d2417] text-xs font-bold transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? 'animate-spin text-[#d96b27]' : ''}`} />
                <span>Sync with Google Sheets</span>
              </button>
            </div>
          </div>

          {/* 4 Grand Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1c120c] border border-[#d4af37]/30 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#e5c158]">Total Registered</p>
              <p className="text-3xl font-black text-white">{totalRegistered}</p>
              <p className="text-[10px] text-[#f4ece1]/60">Master Delegate Roster</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border border-green-500/40 space-y-1">
              <p className="text-[10px] uppercase font-bold text-green-400">Total Present</p>
              <p className="text-3xl font-black text-green-400">{totalPresent}</p>
              <p className="text-[10px] text-green-300/80">{totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0}% Turnout Rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border border-amber-500/40 space-y-1">
              <p className="text-[10px] uppercase font-bold text-amber-300">Total Spot Cash Collected</p>
              <p className="text-3xl font-black text-amber-300">₹{totalCashCollected}</p>
              <p className="text-[10px] text-[#f4ece1]/60">{totalCashCollected / 150} Spot Cash Delegates</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border border-red-500/30 space-y-1">
              <p className="text-[10px] uppercase font-bold text-red-400">Pending Arrival</p>
              <p className="text-3xl font-black text-white">{totalPending}</p>
              <p className="text-[10px] text-[#f4ece1]/60">Yet to Check In</p>
            </div>
          </div>

          {/* VOLUNTEER BREAKDOWN SECTION */}
          <div className="bg-[#1c120c] p-6 rounded-3xl border border-[#d4af37]/30 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-gold-gradient flex items-center gap-2">
              <Award className="w-5 h-5 text-[#e5c158]" />
              Volunteer Desk Breakdown &amp; Cash Audit
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Volunteer 1: Dona George */}
              <div className="p-5 rounded-2xl bg-[#140b07] border-2 border-blue-500/40 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/30">
                      Volunteer Desk #1
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1.5">Dona George</h4>
                  </div>
                  <button
                    onClick={() => setAdminFilter('dona')}
                    className="text-xs font-bold text-blue-300 hover:text-white underline"
                  >
                    View Her List →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#382015]">
                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Delegates Admitted</p>
                    <p className="text-2xl font-black text-white">{donaCheckins.length}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Cash Collected</p>
                    <p className="text-2xl font-black text-amber-300">₹{donaCash}</p>
                  </div>
                </div>
              </div>

              {/* Volunteer 2: Neha Miriam Jose */}
              <div className="p-5 rounded-2xl bg-[#140b07] border-2 border-purple-500/40 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/30">
                      Volunteer Desk #2
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1.5">Neha Miriam Jose</h4>
                  </div>
                  <button
                    onClick={() => setAdminFilter('neha')}
                    className="text-xs font-bold text-purple-300 hover:text-white underline"
                  >
                    View Her List →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#382015]">
                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Delegates Admitted</p>
                    <p className="text-2xl font-black text-white">{nehaCheckins.length}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Cash Collected</p>
                    <p className="text-2xl font-black text-amber-300">₹{nehaCash}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 bg-[#1c120c] p-1.5 rounded-2xl border border-[#d4af37]/30 text-xs w-full sm:w-auto">
              <button
                onClick={() => setAdminFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  adminFilter === 'all' ? 'bg-[#d96b27] text-white shadow-md' : 'text-[#f4ece1]/70 hover:text-white'
                }`}
              >
                All ({allDelegates.length})
              </button>
              <button
                onClick={() => setAdminFilter('present')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  adminFilter === 'present' ? 'bg-green-600 text-white shadow-md' : 'text-green-400 hover:text-white'
                }`}
              >
                Present ({totalPresent})
              </button>
              <button
                onClick={() => setAdminFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  adminFilter === 'pending' ? 'bg-red-600 text-white shadow-md' : 'text-red-300 hover:text-white'
                }`}
              >
                Pending ({totalPending})
              </button>
              <button
                onClick={() => setAdminFilter('dona')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  adminFilter === 'dona' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white'
                }`}
              >
                By Dona ({donaCheckins.length})
              </button>
              <button
                onClick={() => setAdminFilter('neha')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  adminFilter === 'neha' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white'
                }`}
              >
                By Neha ({nehaCheckins.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Name, Ward, House, Pass ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c120c] border border-[#d4af37]/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#d96b27]"
              />
            </div>

          </div>

          {/* Master Table List */}
          <div className="bg-[#1c120c] rounded-3xl border border-[#d4af37]/30 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2a1a12] border-b border-[#382015] text-[#e5c158] font-cinzel uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Pass ID</th>
                    <th className="py-3.5 px-4">Delegate Name</th>
                    <th className="py-3.5 px-4">Ward / House</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Fee Mode</th>
                    <th className="py-3.5 px-4">Attendance Status</th>
                    <th className="py-3.5 px-4">Admitted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#382015]">
                  {adminFilteredList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-gray-500">
                        No delegates match the selected filter or search.
                      </td>
                    </tr>
                  ) : (
                    adminFilteredList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#231610] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#e5c158]">
                          {item.ticketId}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {item.fullName}
                        </td>
                        <td className="py-3 px-4 text-[#f4ece1]/80">
                          {item.parish} • {item.houseName}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#f4ece1]/70">
                          {item.phone || '—'}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {item.isCash ? (
                            <span className="text-amber-300">💵 Spot Cash (₹150)</span>
                          ) : (
                            <span className="text-green-400">✅ Online Paid</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.isPresent ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              PRESENT ({item.checkedInTime})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-700/30 text-gray-400 border border-gray-600/30 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Not Arrived
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-blue-300">
                          {item.isPresent ? (
                            item.checkedInBy || 'Desk'
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
