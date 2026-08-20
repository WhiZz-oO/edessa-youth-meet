import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, AlertTriangle, X, Volume2, VolumeX, 
  Users, Banknote, Search, RefreshCw, Sparkles, ShieldCheck, Zap,
  UserCheck, Award, Lock, ArrowRight, User, Phone, Home, MapPin,
  Clock, Filter, ChevronDown, Check, Smartphone, CreditCard, DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';

const VOLUNTEERS = [
  { id: 'dona', name: 'Dona George' },
  { id: 'neha', name: 'Neha Miriam Jose' },
];

export default function ContinuousScanner({ onClose }) {
  const [activeVolunteer, setActiveVolunteer] = useState(() => {
    return localStorage.getItem('edessa_active_volunteer') || 'Dona George';
  });

  const [viewTab, setViewTab] = useState('desk'); // 'desk' | 'admin'
  const [allDelegates, setAllDelegates] = useState([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('');

  // Active Popup Modal State
  const [selectedDelegate, setSelectedDelegate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState(null); // 'confirm' | 'locked' | 'success'

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'present' | 'cash_in_hand' | 'upi_online' | 'dona' | 'neha'
  const [selectedWard, setSelectedWard] = useState('all');

  const allDelegatesRef = useRef([]);

  useEffect(() => {
    allDelegatesRef.current = allDelegates;
  }, [allDelegates]);

  // 1. Fetch Master Live Database from Google Sheet
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

            const match = attendanceRaw.match(/\((.*?)\)/);
            checkedInTime = match ? match[1].replace(/by.*|•.*/i, '').trim() : 'Checked In';
          }

          const isCash = !paymentMode.toLowerCase().includes('gpay') && 
                         !paymentMode.toLowerCase().includes('upi') && 
                         !paymentMode.toLowerCase().includes('google') &&
                         !paymentMode.toLowerCase().includes('online');

          return {
            rowId: idx + 2,
            ticketId,
            fullName,
            houseName,
            phone,
            parish,
            age,
            email,
            paymentMode: isCash ? 'Spot Cash (Pay at Desk)' : 'Google Pay / UPI (Online)',
            isCash,
            isPresent,
            attendanceRaw,
            checkedInBy,
            checkedInTime,
          };
        }).filter(d => d.ticketId && d.fullName);

        setAllDelegates(delegates);
        allDelegatesRef.current = delegates;
        setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      }
    } catch (err) {
      console.warn('Sheet live sync warning:', err);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  // Poll Google Sheets every 6 seconds for live multi-device sync
  useEffect(() => {
    fetchLiveSheetData();
    const interval = setInterval(fetchLiveSheetData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleVolunteerChange = (name) => {
    setActiveVolunteer(name);
    localStorage.setItem('edessa_active_volunteer', name);
  };

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
        osc.frequency.setValueAtTime(250, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  // Open Pop-up Modal when clicking a participant
  const handleOpenCheckinModal = (delegate) => {
    setSelectedDelegate(delegate);
    if (delegate.isPresent) {
      playBeep(false);
      setModalState('locked');
    } else {
      playBeep(true);
      setModalState('confirm');
    }
  };

  // Confirm Check-in & Record in Cloud
  const handleConfirmCheckin = async () => {
    if (!selectedDelegate) return;
    setIsSubmitting(true);

    const checkinTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedAttendance = `${checkinTime} • ${activeVolunteer}`;

    // Optimistic UI update
    setAllDelegates(prev => prev.map(d => {
      if (d.ticketId === selectedDelegate.ticketId) {
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

    setModalState('success');
    setSelectedDelegate(prev => ({
      ...prev,
      isPresent: true,
      checkedInBy: activeVolunteer,
      checkedInTime: checkinTime,
    }));

    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.5 },
    });

    // Send to Google Sheets webhook
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'checkin',
            ticketId: selectedDelegate.ticketId,
            fullName: selectedDelegate.fullName,
            time: formattedAttendance,
          }),
        });
      } catch (err) {
        console.warn('Checkin post warning:', err);
      }
    }

    setIsSubmitting(false);

    // Auto-close success modal after 1.6 seconds
    setTimeout(() => {
      setSelectedDelegate(null);
      setModalState(null);
      fetchLiveSheetData();
    }, 1600);
  };

  const handleCloseModal = () => {
    setSelectedDelegate(null);
    setModalState(null);
  };

  // Unique Ward List
  const wardList = Array.from(new Set(allDelegates.map(d => d.parish).filter(Boolean))).sort();

  // Filtered Delegates for Desk & Admin View
  const filteredList = allDelegates.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      item.fullName.toLowerCase().includes(q) ||
      item.ticketId.toLowerCase().includes(q) ||
      item.parish.toLowerCase().includes(q) ||
      item.houseName.toLowerCase().includes(q) ||
      item.phone.includes(q);

    if (!matchSearch) return false;

    if (selectedWard !== 'all' && item.parish !== selectedWard) return false;

    if (statusFilter === 'pending') return !item.isPresent;
    if (statusFilter === 'present') return item.isPresent;
    if (statusFilter === 'cash_in_hand') return item.isPresent && item.isCash;
    if (statusFilter === 'upi_online') return item.isPresent && !item.isCash;
    if (statusFilter === 'dona') return item.isPresent && item.checkedInBy?.includes('Dona');
    if (statusFilter === 'neha') return item.isPresent && item.checkedInBy?.includes('Neha');
    return true;
  });

  // Sort: Pending arrivals first, then alphabetical
  const sortedList = [...filteredList].sort((a, b) => {
    if (a.isPresent === b.isPresent) {
      return a.fullName.localeCompare(b.fullName);
    }
    return a.isPresent ? 1 : -1;
  });

  // Comprehensive Financial & Attendance Calculations
  const totalRegistered = allDelegates.length;
  const presentDelegates = allDelegates.filter(d => d.isPresent);
  const totalPresent = presentDelegates.length;
  const totalPending = totalRegistered - totalPresent;

  // Physical Cash in Hand vs UPI in Bank
  const presentCashDelegates = presentDelegates.filter(d => d.isCash);
  const presentUpiDelegates = presentDelegates.filter(d => !d.isCash);

  const totalPhysicalCashInHand = presentCashDelegates.length * 150;
  const totalUpiPaidInBank = presentUpiDelegates.length * 150;
  const grandTotalRevenue = totalPhysicalCashInHand + totalUpiPaidInBank;

  // Dona George Audit
  const donaCheckins = allDelegates.filter(d => d.isPresent && (d.checkedInBy?.includes('Dona')));
  const donaPhysicalCash = donaCheckins.filter(d => d.isCash).length * 150;
  const donaUpiCount = donaCheckins.filter(d => !d.isCash).length;

  // Neha Miriam Jose Audit
  const nehaCheckins = allDelegates.filter(d => d.isPresent && (d.checkedInBy?.includes('Neha')));
  const nehaPhysicalCash = nehaCheckins.filter(d => d.isCash).length * 150;
  const nehaUpiCount = nehaCheckins.filter(d => !d.isCash).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0705] text-white flex flex-col overflow-y-auto font-sans">
      
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 bg-[#1c120c]/95 backdrop-blur-md border-b border-[#d4af37]/30 px-3.5 sm:px-6 py-2.5 flex items-center justify-between shadow-xl flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center font-bold text-white shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-gold-gradient tracking-wide">
              EDESSA 2026 • Registration Desk
            </h2>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Cloud Synced
              </span>
              {lastSyncTime && <span className="text-[#f4ece1]/50 hidden sm:inline">• Synced {lastSyncTime}</span>}
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Volunteer Toggle */}
          <div className="flex items-center bg-[#140b07] p-1 rounded-xl border border-[#d4af37]/30 text-xs">
            <span className="text-[10px] text-[#f4ece1]/60 px-1.5 hidden md:inline">Operating Desk:</span>
            {VOLUNTEERS.map(v => (
              <button
                key={v.id}
                onClick={() => handleVolunteerChange(v.name)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                  activeVolunteer === v.name
                    ? 'bg-orange-gradient text-white shadow-md'
                    : 'text-[#f4ece1]/70 hover:text-white'
                }`}
              >
                {v.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* View Tab Switch */}
          <div className="flex bg-[#140b07] p-1 rounded-xl border border-[#d4af37]/30 text-xs">
            <button
              onClick={() => setViewTab('desk')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                viewTab === 'desk'
                  ? 'bg-[#d96b27] text-white shadow-md'
                  : 'text-[#f4ece1]/70 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Desk</span>
            </button>
            <button
              onClick={() => setViewTab('admin')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                viewTab === 'admin'
                  ? 'bg-[#d96b27] text-white shadow-md'
                  : 'text-[#f4ece1]/70 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Admin Report</span>
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={fetchLiveSheetData}
            disabled={isLoadingSheet}
            className="p-2 rounded-xl bg-[#2a1a12] border border-[#d4af37]/30 text-[#e5c158] hover:bg-[#3d2417] text-xs font-bold transition-all cursor-pointer"
            title="Refresh from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? 'animate-spin text-[#d96b27]' : ''}`} />
          </button>

          {/* Close Desk */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. REGISTRATION DESK VIEW */}
      {viewTab === 'desk' && (
        <div className="flex-1 p-3.5 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
          
          {/* Active Operating Desk Info Banner */}
          <div className="p-3 px-4 rounded-2xl bg-[#1c120c] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#d96b27]/20 border border-[#d96b27] flex items-center justify-center text-[#e5c158]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span>Operating Desk: <strong className="text-[#e5c158] text-sm">{activeVolunteer}</strong></span>
                <p className="text-[10px] text-[#f4ece1]/60">Select participant below to collect fee &amp; confirm attendance</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-green-400 font-bold bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {totalPresent} of {totalRegistered} Present
              </span>
            </div>
          </div>

          {/* Key Financial & Attendance Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#1c120c] p-3.5 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-[#e5c158]">Total Present</p>
                <p className="text-2xl font-black text-white">{totalPresent} <span className="text-xs text-gray-400 font-normal">/ {totalRegistered}</span></p>
              </div>
              <Users className="w-6 h-6 text-[#e5c158]" />
            </div>

            <div className="bg-[#1c120c] p-3.5 rounded-2xl border border-amber-500/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-300 flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" /> Physical Cash in Hand
                </p>
                <p className="text-2xl font-black text-amber-400">₹{totalPhysicalCashInHand}</p>
                <p className="text-[9px] text-[#f4ece1]/60">{presentCashDelegates.length} cash delegates to count</p>
              </div>
            </div>

            <div className="bg-[#1c120c] p-3 rounded-2xl border border-blue-500/30 space-y-0.5">
              <p className="text-[10px] text-blue-400 font-bold uppercase">👩 Dona George (In Hand)</p>
              <p className="text-xl font-black text-amber-300">₹{donaPhysicalCash}</p>
              <p className="text-[10px] text-[#f4ece1]/70">{donaCheckins.length} admitted • {donaUpiCount} UPI</p>
            </div>

            <div className="bg-[#1c120c] p-3 rounded-2xl border border-purple-500/30 space-y-0.5">
              <p className="text-[10px] text-purple-400 font-bold uppercase">👩 Neha Miriam (In Hand)</p>
              <p className="text-xl font-black text-amber-300">₹{nehaPhysicalCash}</p>
              <p className="text-[10px] text-[#f4ece1]/70">{nehaCheckins.length} admitted • {nehaUpiCount} UPI</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#1c120c] p-3.5 rounded-2xl border border-[#d4af37]/30 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name, House Name, Ward, or Phone..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#140b07] border border-[#d4af37]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d96b27]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="sm:w-48">
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full py-3 px-3 rounded-xl bg-[#140b07] border border-[#d4af37]/40 text-white text-xs font-bold focus:outline-none focus:border-[#d96b27] cursor-pointer"
                >
                  <option value="all">All Wards ({allDelegates.length})</option>
                  {wardList.map((w, idx) => {
                    const count = allDelegates.filter(d => d.parish === w).length;
                    return <option key={idx} value={w}>{w} ({count})</option>;
                  })}
                </select>
              </div>

            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs pt-1 border-t border-[#382015]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#d96b27] text-white shadow-md' : 'text-[#f4ece1]/70 hover:text-white bg-[#140b07]'
                }`}
              >
                All ({allDelegates.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  statusFilter === 'pending' ? 'bg-amber-600 text-white shadow-md' : 'text-amber-300 hover:text-white bg-[#140b07]'
                }`}
              >
                ⏳ Pending ({totalPending})
              </button>
              <button
                onClick={() => setStatusFilter('present')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  statusFilter === 'present' ? 'bg-green-600 text-white shadow-md' : 'text-green-400 hover:text-white bg-[#140b07]'
                }`}
              >
                ✅ Present ({totalPresent})
              </button>
              <button
                onClick={() => setStatusFilter('cash_in_hand')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'cash_in_hand' ? 'bg-amber-500 text-black shadow-md' : 'text-amber-400 hover:text-white bg-[#140b07]'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash In Hand ({presentCashDelegates.length})</span>
              </button>
              <button
                onClick={() => setStatusFilter('upi_online')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'upi_online' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white bg-[#140b07]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI Paid ({presentUpiDelegates.length})</span>
              </button>
            </div>
          </div>

          {/* Participant Cards Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1 text-xs text-[#f4ece1]/70">
              <span>Showing {sortedList.length} Participants</span>
              <span>Tap <strong>Admit &amp; Collect Fee</strong> to open prompt</span>
            </div>

            {sortedList.length === 0 ? (
              <div className="p-12 text-center bg-[#1c120c] rounded-3xl border border-[#d4af37]/20 space-y-2">
                <Users className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-sm font-bold text-gray-400">No participants match your search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedList.map((delegate, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      delegate.isPresent
                        ? 'bg-[#140b07] border-green-500/30'
                        : 'bg-[#1c120c] border-[#d4af37]/30 hover:border-[#e5c158]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                          {delegate.fullName}
                        </h3>
                        <p className="text-xs text-[#e5c158] font-medium mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#d96b27]" />
                          <span>{delegate.parish}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-[#f4ece1]/80 truncate">{delegate.houseName}</span>
                        </p>
                      </div>

                      <span className="font-mono text-[11px] font-bold text-[#e5c158] bg-[#2a1a12] px-2.5 py-1 rounded-lg border border-[#d4af37]/30 flex-shrink-0">
                        {delegate.ticketId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#382015]">
                      <span className="text-[11px] text-[#f4ece1]/70 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {delegate.phone || '—'}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        delegate.isCash ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {delegate.isCash ? (
                          <>
                            <Banknote className="w-3 h-3" />
                            <span>💵 Spot Cash (₹150)</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3 h-3" />
                            <span>📱 UPI Paid (Online)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      {delegate.isPresent ? (
                        <div 
                          onClick={() => handleOpenCheckinModal(delegate)}
                          className="w-full py-2.5 px-3 rounded-xl bg-green-500/10 border border-green-500/40 text-green-400 text-xs font-bold flex items-center justify-between cursor-pointer hover:bg-green-500/20 transition-all"
                        >
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>PRESENT ({delegate.checkedInTime})</span>
                          </div>
                          <span className="text-[10px] text-blue-300 font-medium truncate">
                            By {delegate.checkedInBy || 'Desk'}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenCheckinModal(delegate)}
                          className="w-full py-3 px-4 rounded-xl bg-orange-gradient hover:brightness-110 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md border border-[#e5c158]/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Admit &amp; Collect Fee →</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. MASTER SUPER ADMIN REPORT DASHBOARD & CASH AUDIT TABLE */}
      {viewTab === 'admin' && (
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
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
                className="px-4 py-2 rounded-xl bg-[#2a1a12] border border-[#d4af37]/40 text-[#e5c158] hover:bg-[#3d2417] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingSheet ? 'animate-spin text-[#d96b27]' : ''}`} />
                <span>Sync with Google Sheets</span>
              </button>
            </div>
          </div>

          {/* Grand Summary Stat Cards with Cash Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1c120c] border border-[#d4af37]/30 space-y-1">
              <p className="text-[10px] uppercase font-bold text-[#e5c158]">Total Registered</p>
              <p className="text-3xl font-black text-white">{totalRegistered}</p>
              <p className="text-[10px] text-[#f4ece1]/60">Master Delegate Roster</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border border-green-500/40 space-y-1">
              <p className="text-[10px] uppercase font-bold text-green-400">Total Present</p>
              <p className="text-3xl font-black text-green-400">{totalPresent}</p>
              <p className="text-[10px] text-green-300/80">{totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0}% Turnout</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border-2 border-amber-500/50 space-y-1">
              <p className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" /> Physical Cash in Hand
              </p>
              <p className="text-3xl font-black text-amber-300">₹{totalPhysicalCashInHand}</p>
              <p className="text-[10px] text-amber-200/80">{presentCashDelegates.length} delegates paid cash</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c120c] border border-blue-500/40 space-y-1">
              <p className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> UPI Paid (In Bank)
              </p>
              <p className="text-3xl font-black text-blue-400">₹{totalUpiPaidInBank}</p>
              <p className="text-[10px] text-blue-200/80">{presentUpiDelegates.length} delegates verified</p>
            </div>
          </div>

          {/* Volunteer Breakdown Section with Cash in Hand Audit */}
          <div className="bg-[#1c120c] p-6 rounded-3xl border border-[#d4af37]/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-lg font-bold text-gold-gradient flex items-center gap-2">
                <Award className="w-5 h-5 text-[#e5c158]" />
                Volunteer Desk Breakdown &amp; Physical Cash Audit
              </h3>
              <span className="text-xs text-[#e5c158] bg-black/40 px-3 py-1 rounded-xl border border-[#d4af37]/30">
                Total Cash to Collect from Desks: <strong>₹{totalPhysicalCashInHand}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dona George Card */}
              <div className="p-5 rounded-2xl bg-[#140b07] border-2 border-blue-500/40 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/30">
                      Volunteer Desk #1
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1.5">Dona George</h4>
                  </div>
                  <button
                    onClick={() => setStatusFilter('dona')}
                    className="text-xs font-bold text-blue-300 hover:text-white underline cursor-pointer"
                  >
                    Filter Her List ({donaCheckins.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#382015]">
                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Delegates Admitted</p>
                    <p className="text-2xl font-black text-white">{donaCheckins.length}</p>
                    <p className="text-[10px] text-blue-300 mt-0.5">{donaUpiCount} paid via UPI</p>
                  </div>

                  <div className="bg-[#1c120c] p-2.5 rounded-xl border border-amber-500/30">
                    <p className="text-[10px] text-amber-300 uppercase font-bold">💵 Cash in Dona's Hand</p>
                    <p className="text-2xl font-black text-amber-400">₹{donaPhysicalCash}</p>
                    <p className="text-[9px] text-[#f4ece1]/60">Physical cash to collect</p>
                  </div>
                </div>
              </div>

              {/* Neha Miriam Jose Card */}
              <div className="p-5 rounded-2xl bg-[#140b07] border-2 border-purple-500/40 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/30">
                      Volunteer Desk #2
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1.5">Neha Miriam Jose</h4>
                  </div>
                  <button
                    onClick={() => setStatusFilter('neha')}
                    className="text-xs font-bold text-purple-300 hover:text-white underline cursor-pointer"
                  >
                    Filter Her List ({nehaCheckins.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#382015]">
                  <div>
                    <p className="text-[10px] text-[#f4ece1]/60 uppercase">Delegates Admitted</p>
                    <p className="text-2xl font-black text-white">{nehaCheckins.length}</p>
                    <p className="text-[10px] text-purple-300 mt-0.5">{nehaUpiCount} paid via UPI</p>
                  </div>

                  <div className="bg-[#1c120c] p-2.5 rounded-xl border border-amber-500/30">
                    <p className="text-[10px] text-amber-300 uppercase font-bold">💵 Cash in Neha's Hand</p>
                    <p className="text-2xl font-black text-amber-400">₹{nehaPhysicalCash}</p>
                    <p className="text-[9px] text-[#f4ece1]/60">Physical cash to collect</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Filter & Search Bar for Admin Table */}
          <div className="bg-[#1c120c] p-4 rounded-2xl border border-[#d4af37]/30 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    statusFilter === 'all' ? 'bg-[#d96b27] text-white shadow-md' : 'text-[#f4ece1]/70 hover:text-white bg-[#140b07]'
                  }`}
                >
                  All ({allDelegates.length})
                </button>
                <button
                  onClick={() => setStatusFilter('present')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    statusFilter === 'present' ? 'bg-green-600 text-white shadow-md' : 'text-green-400 hover:text-white bg-[#140b07]'
                  }`}
                >
                  Present ({totalPresent})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    statusFilter === 'pending' ? 'bg-red-600 text-white shadow-md' : 'text-red-300 hover:text-white bg-[#140b07]'
                  }`}
                >
                  Pending ({totalPending})
                </button>
                <button
                  onClick={() => setStatusFilter('cash_in_hand')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'cash_in_hand' ? 'bg-amber-500 text-black shadow-md' : 'text-amber-400 hover:text-white bg-[#140b07]'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash in Hand ({presentCashDelegates.length})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('upi_online')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'upi_online' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white bg-[#140b07]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Paid ({presentUpiDelegates.length})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('dona')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    statusFilter === 'dona' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300 hover:text-white bg-[#140b07]'
                  }`}
                >
                  By Dona ({donaCheckins.length})
                </button>
                <button
                  onClick={() => setStatusFilter('neha')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    statusFilter === 'neha' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-300 hover:text-white bg-[#140b07]'
                  }`}
                >
                  By Neha ({nehaCheckins.length})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Name, Ward, House..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140b07] border border-[#d4af37]/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#d96b27]"
                />
              </div>

            </div>
          </div>

          {/* Full Master Table */}
          <div className="bg-[#1c120c] rounded-3xl border border-[#d4af37]/30 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2a1a12] border-b border-[#382015] text-[#e5c158] font-cinzel uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Pass ID</th>
                    <th className="py-3.5 px-4">Delegate Name</th>
                    <th className="py-3.5 px-4">Ward / House</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Fee Mode / Cash Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Admitted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#382015]">
                  {sortedList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-gray-500">
                        No delegates match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    sortedList.map((item, idx) => (
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
                            <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Banknote className="w-3.5 h-3.5" /> 💵 Spot Cash (₹150 in Hand)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                              <Smartphone className="w-3.5 h-3.5" /> 📱 Online UPI (In Bank)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.isPresent ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              PRESENT ({item.checkedInTime})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-700/30 text-gray-400 border border-gray-600/30">
                              Not Arrived
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-blue-300">
                          {item.isPresent ? (item.checkedInBy || 'Desk') : '—'}
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

      {/* 4. THE EXACT "DELEGATE CHECK-IN & FEE" MODAL */}
      {selectedDelegate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative max-w-md w-full bg-[#1c120c] rounded-3xl border-2 border-[#d4af37] shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className={`p-4 text-center border-b flex items-center justify-between px-6 ${
              modalState === 'locked'
                ? 'bg-red-950/80 border-red-500/40 text-red-300'
                : modalState === 'success'
                ? 'bg-green-950/80 border-green-500/40 text-green-300'
                : 'bg-orange-gradient border-[#e5c158]/50 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {modalState === 'locked' ? (
                  <Lock className="w-5 h-5 text-red-400" />
                ) : modalState === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-[#ffe8aa]" />
                )}
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase">
                  {modalState === 'locked'
                    ? '⛔ Locked: Already Admitted'
                    : modalState === 'success'
                    ? '🎉 Attendance Confirmed'
                    : '⚡ DELEGATE CHECK-IN & FEE'}
                </span>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* Delegate Details Card */}
              <div className="bg-[#140b07] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2">
                <div className="flex justify-between items-start border-b border-[#382015] pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#e5c158]">DELEGATE NAME</span>
                    <h3 className="text-xl font-black text-white mt-0.5 uppercase tracking-wide">
                      {selectedDelegate.fullName}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#e5c158] bg-[#2a1a12] px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                    {selectedDelegate.ticketId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-white/60 text-[10px] uppercase font-bold">WARD NUMBER</span>
                    <p className="font-bold text-[#e5c158]">{selectedDelegate.parish}</p>
                  </div>
                  <div>
                    <span className="text-white/60 text-[10px] uppercase font-bold">HOUSE NAME</span>
                    <p className="font-bold text-white truncate">{selectedDelegate.houseName}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/60 text-[10px] uppercase font-bold">PHONE NUMBER</span>
                    <p className="font-mono font-medium text-white">{selectedDelegate.phone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* CASE A: LOCKED WARNING */}
              {modalState === 'locked' && (
                <div className="p-4 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-red-300 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>ALREADY VERIFIED &amp; ADMITTED!</span>
                  </div>
                  <p className="leading-relaxed">
                    This participant was <strong>ALREADY CHECKED IN</strong> at <strong>{selectedDelegate.checkedInTime}</strong> by <strong>{selectedDelegate.checkedInBy || 'Volunteer'}</strong>.
                  </p>
                  <p className="text-[11px] text-red-300/80 font-bold bg-black/40 p-2 rounded-lg">
                    🔒 Status is LOCKED. Cannot be checked in again!
                  </p>
                </div>
              )}

              {/* CASE B: SPOT CASH CONFIRMATION */}
              {modalState === 'confirm' && selectedDelegate.isCash && (
                <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        💵 COLLECT ₹150 SPOT CASH
                      </p>
                      <p className="text-[11px] text-[#f4ece1]/80 mt-0.5">
                        Collect ₹150 physical cash from delegate before confirming.
                      </p>
                    </div>
                    <span className="text-2xl font-black text-amber-300 bg-black/50 px-3 py-1.5 rounded-xl border border-amber-500/40">
                      ₹150
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCheckin}
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-2xl bg-green-600 hover:bg-green-500 active:scale-95 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {isSubmitting
                        ? 'Recording...'
                        : `Confirm ₹150 Received & Check In (by ${activeVolunteer})`}
                    </span>
                  </button>
                </div>
              )}

              {/* CASE C: ONLINE UPI VERIFICATION */}
              {modalState === 'confirm' && !selectedDelegate.isCash && (
                <div className="p-4 rounded-2xl bg-blue-500/20 border-2 border-blue-500 text-white space-y-3">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-400" />
                    <div>
                      <p className="text-sm font-extrabold text-blue-300">📱 Already Paid Online via UPI</p>
                      <p className="text-[10px] text-[#f4ece1]/70 mt-0.5">₹150 received in Church Bank Account. ₹0 to collect at desk.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmCheckin}
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-2xl bg-green-600 hover:bg-green-500 active:scale-95 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {isSubmitting
                        ? 'Recording...'
                        : `Confirm & Hand Delegate Badge (by ${activeVolunteer})`}
                    </span>
                  </button>
                </div>
              )}

              {/* CASE D: SUCCESS */}
              {modalState === 'success' && (
                <div className="p-4 rounded-2xl bg-green-500/20 border-2 border-green-500 text-green-300 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Admitted Successfully!</h4>
                  <p className="text-xs text-green-300">
                    Checked in by <strong>{selectedDelegate.checkedInBy}</strong> at {selectedDelegate.checkedInTime}
                  </p>
                </div>
              )}

              {/* Cancel / Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full py-2.5 rounded-xl bg-[#2a1a12] hover:bg-[#382015] text-[#f4ece1]/80 font-bold text-xs border border-[#d4af37]/30 transition-colors cursor-pointer"
              >
                {modalState === 'locked' ? 'Close' : 'Cancel / Close'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
