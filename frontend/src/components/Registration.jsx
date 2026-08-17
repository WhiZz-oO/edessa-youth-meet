import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Upload, FileImage, ShieldCheck, 
  Sparkles, User, Phone, MapPin, Mail, Calendar, Eye, Trash2, Cross,
  CreditCard, Banknote, HelpCircle, ArrowRight, Copy, Check, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS } from '../data/mockData';
import TicketModal from './TicketModal';
import gpayQr from '../assets/gpay-qr.png';

export default function Registration({ isOpen, onClose }) {
  const [paymentMode, setPaymentMode] = useState('gpay'); // 'gpay' or 'cash'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    parish: '',
    age: '',
    email: '',
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Mock local registration database
  const [registeredList, setRegisteredList] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const upiPayUrl = `upi://pay?pa=${EVENT_DETAILS.gpayUpiId}&pn=Albin%20Mathews&am=150&cu=INR&tn=EDESSA%202026%20Registration`;

  useEffect(() => {
    const saved = localStorage.getItem('edessa_registrations');
    if (saved) {
      try {
        setRegisteredList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse registrations', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.gpayUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
    setVerificationError('');
    if (mode === 'cash') {
      setIsVerified(true);
      setTxnRef('CASH-DESK');
    } else {
      if (!screenshotFile) {
        setIsVerified(false);
        setTxnRef('');
      }
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setVerificationError('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    setScreenshotFile(file);
    setVerificationError('');
    setIsVerified(false);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
      simulateScreenshotVerification();
    };
    reader.readAsDataURL(file);
  };

  const simulateScreenshotVerification = () => {
    setIsVerifying(true);
    setVerificationError('');

    setTimeout(() => {
      setIsVerifying(false);
      const randomTxn = 'GPAY-' + Math.floor(100000000000 + Math.random() * 900000000000);
      setTxnRef(randomTxn);
      setIsVerified(true);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMode === 'gpay' && !isVerified) {
      setVerificationError('GPay payment screenshot verification is required before submission.');
      return;
    }

    const newTicketId = 'EDESSA-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newEntry = {
      ticketId: newTicketId,
      fullName: formData.fullName,
      phone: formData.phone,
      parish: formData.parish,
      age: formData.age,
      email: formData.email,
      paymentMode: paymentMode, // 'gpay' or 'cash'
      txnRef: paymentMode === 'cash' ? 'SPOT-CASH' : txnRef,
      dateRegistered: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedList = [newEntry, ...registeredList];
    setRegisteredList(updatedList);
    localStorage.setItem('edessa_registrations', JSON.stringify(updatedList));

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setGeneratedTicket(newEntry);

    // Reset form
    setFormData({ fullName: '', phone: '', parish: '', age: '', email: '' });
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (paymentMode === 'gpay') {
      setIsVerified(false);
      setTxnRef('');
    }
  };

  const handleClearDatabase = () => {
    if (window.confirm('Are you sure you want to clear all mock registrations?')) {
      setRegisteredList([]);
      localStorage.removeItem('edessa_registrations');
    }
  };

  return (
    <section id="register" className="py-24 bg-wood-dark relative overflow-hidden text-white">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d96b27]/10 text-[#ff9e58] text-xs font-extrabold uppercase tracking-widest mb-3 border border-[#d96b27]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Registration Portal
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient mb-4">
            Register for EDESSA 2026
          </h2>
          <p className="font-garamond text-xl italic text-[#f4ece1]/80">
            Complete your delegate details and select your preferred payment mode (GPay / Cash)
          </p>
        </div>

        {/* Payment Mode Selector Tabs */}
        <div className="max-w-md mx-auto mb-10 p-1.5 rounded-2xl bg-[#1c120c] border border-[#d4af37]/30 flex items-center shadow-xl">
          <button
            type="button"
            onClick={() => handlePaymentModeChange('gpay')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'gpay'
                ? 'bg-orange-gradient text-white shadow-lg border border-[#e5c158]/50 scale-[1.02]'
                : 'text-[#f4ece1]/70 hover:text-white hover:bg-[#2a1a12]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Google Pay / UPI
          </button>

          <button
            type="button"
            onClick={() => handlePaymentModeChange('cash')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              paymentMode === 'cash'
                ? 'bg-orange-gradient text-white shadow-lg border border-[#e5c158]/50 scale-[1.02]'
                : 'text-[#f4ece1]/70 hover:text-white hover:bg-[#2a1a12]'
            }`}
          >
            <Banknote className="w-4 h-4" />
            Spot Cash (Pay at Desk)
          </button>
        </div>

        {/* Form & Payment Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Payment Details */}
          <div className="lg:col-span-5 bg-[#1c120c] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-6">
            
            {paymentMode === 'gpay' ? (
              /* GPay / UPI View */
              <>
                <div className="flex items-center justify-between border-b border-[#382015] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Payment Mode</span>
                    <h3 className="font-cinzel text-xl font-bold text-white">GPay / UPI Payment</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#d96b27] text-white shadow-md">
                    ₹150
                  </span>
                </div>

                {/* Direct Tap to Pay on Mobile */}
                <a
                  href={upiPayUrl}
                  className="w-full py-3 px-4 rounded-xl bg-orange-gradient text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#d96b27]/30 border border-[#e5c158]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Tap to Pay ₹150 via UPI App</span>
                </a>

                {/* QR Code Container */}
                <div className="bg-[#2a1a12] p-4 rounded-2xl border border-[#4a2c1d] flex flex-col items-center text-center shadow-inner">
                  <div className="w-56 h-56 bg-white rounded-2xl p-2.5 shadow-2xl border-2 border-[#e5c158] flex items-center justify-center overflow-hidden">
                    <img src={gpayQr} alt="GPay UPI QR Code - albinmathewsktu70@okaxis" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <p className="text-xs font-bold text-[#e5c158] mt-3 font-cinzel tracking-wide">
                    Scan & Pay ₹150 via GPay / PhonePe / Paytm / BHIM
                  </p>
                  <p className="text-[11px] text-[#f4ece1]/70 mt-0.5">
                    Amount (₹150) & Note are pre-configured in QR code
                  </p>
                </div>

                {/* UPI Details Box */}
                <div className="p-4 rounded-2xl bg-[#2a1a12] border border-[#4a2c1d] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#f4ece1]/60 font-semibold uppercase text-[10px]">UPI ID</p>
                      <p className="font-mono text-sm font-bold text-[#e5c158]">
                        {EVENT_DETAILS.gpayUpiId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-[#3d2417] text-[#e5c158] hover:bg-[#d96b27] hover:text-white transition-colors flex items-center gap-1 font-bold text-xs"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <p className="text-[#f4ece1]/60 font-semibold uppercase text-[10px]">GPay Contact Number</p>
                    <p className="font-mono text-sm font-bold text-white">
                      {EVENT_DETAILS.gpayNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#f4ece1]/60 font-semibold uppercase text-[10px]">Beneficiary Name</p>
                    <p className="text-xs font-medium text-[#f4ece1]">
                      Albin Mathews (SMYM Unit President)
                    </p>
                  </div>
                </div>

                {/* Verification Note */}
                <div className="p-3 rounded-xl bg-[#2a1a12]/60 border border-[#4a2c1d] text-[11px] text-[#f4ece1]/70 space-y-1">
                  <p>📌 Note: Screenshot must clearly show Transaction ID or Reference number.</p>
                </div>
              </>
            ) : (
              /* Spot Cash View */
              <>
                <div className="flex items-center justify-between border-b border-[#382015] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Payment Mode</span>
                    <h3 className="font-cinzel text-xl font-bold text-white">Spot Cash Payment</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#e5c158] text-[#1c120c]">
                    ₹150
                  </span>
                </div>

                <div className="py-8 px-4 rounded-2xl bg-[#2a1a12] border border-[#d4af37]/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#3d2417] text-[#e5c158] flex items-center justify-center mx-auto text-3xl shadow-inner border border-[#d4af37]/40">
                    <Banknote className="w-8 h-8 text-[#e5c158]" />
                  </div>

                  <div>
                    <h4 className="font-cinzel text-lg font-bold text-gold-gradient">
                      Pay at Registration Desk
                    </h4>
                    <p className="text-xs text-[#f4ece1]/80 mt-2 leading-relaxed">
                      You can pay the registration fee of <strong className="text-[#e5c158]">₹150 in cash</strong> directly at the counter upon arrival on <strong>25 August 2026</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1c120c] border border-[#4a2c1d] text-left text-xs text-[#f4ece1]/75 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" /> No screenshot upload required
                    </p>
                    <p className="flex items-center gap-1.5 text-[#ff9e58] font-semibold">
                      <Sparkles className="w-4 h-4" /> Instant ticket generation
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#2a1a12]/60 border border-[#4a2c1d] text-[11px] text-[#f4ece1]/70">
                  <p>📍 <strong>Venue:</strong> 12 Apostles Auditorium, Chemmalamattom</p>
                </div>
              </>
            )}

            {/* View Stored Local DB link */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="text-xs text-[#e5c158]/70 hover:text-[#e5c158] underline font-garamond"
              >
                View Saved Registrations ({registeredList.length})
              </button>
            </div>

          </div>

          {/* Right Column: Delegate Information Form */}
          <div className="lg:col-span-7 bg-[#1c120c] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
            
            <div className="border-b border-[#382015] pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Step 2: Information</span>
              <h3 className="font-cinzel text-xl font-bold text-white">Fill Registration Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                  />
                </div>
              </div>

              {/* Phone & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 digit mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="12"
                    max="45"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 21"
                    className="w-full px-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                  />
                </div>
              </div>

              {/* Ward Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Ward Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                  <select
                    name="parish"
                    value={formData.parish}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm cursor-pointer appearance-none"
                  >
                    <option value="">Select your Ward (1 – 30)</option>
                    {Array.from({ length: 30 }, (_, i) => (
                      <option key={i + 1} value={`Ward ${i + 1}`}>
                        Ward {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                  />
                </div>
              </div>

              {/* Conditional GPay Screenshot Upload Area */}
              {paymentMode === 'gpay' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    Upload GPay Screenshot <span className="text-red-400">*</span>
                  </label>

                  <div className="relative border-2 border-dashed border-[#d4af37]/40 hover:border-[#d96b27] rounded-2xl p-4 text-center bg-[#1a0f0a] transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {screenshotPreview ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4 text-left p-2">
                        <img
                          src={screenshotPreview}
                          alt="GPay Screenshot"
                          className="w-20 h-20 object-cover rounded-xl border border-[#e5c158] shadow-md flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {screenshotFile?.name}
                          </p>
                          {isVerifying && (
                            <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse font-medium">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                              Analyzing & Verifying GPay Screenshot...
                            </div>
                          )}
                          {isVerified && (
                            <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/30">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              GPay Screenshot Verified! (Txn ID: {txnRef})
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="w-12 h-12 rounded-full bg-[#3d2417] text-[#e5c158] group-hover:bg-[#d96b27] group-hover:text-white flex items-center justify-center mx-auto transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold text-white">
                          Click or Drag & Drop GPay Payment Screenshot
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Supports PNG, JPG, JPEG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {verificationError && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {verificationError}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={paymentMode === 'gpay' && !isVerified}
                className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 shadow-xl border flex items-center justify-center gap-2 ${
                  paymentMode === 'cash' || isVerified
                    ? 'bg-orange-gradient text-white border-[#e5c158]/60 shadow-[#d96b27]/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-[#2a1a12] text-gray-500 border-[#382015] cursor-not-allowed opacity-70'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                {paymentMode === 'cash'
                  ? 'Confirm Registration (Spot Cash)'
                  : isVerified
                  ? 'Confirm & Generate Delegate Ticket'
                  : 'Upload GPay Screenshot to Register'}
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Ticket Pass Modal */}
      {generatedTicket && (
        <TicketModal
          ticketData={generatedTicket}
          onClose={() => setGeneratedTicket(null)}
        />
      )}

      {/* Admin Registered List Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-wood-card rounded-3xl border-2 border-[#d4af37] shadow-2xl p-6 text-white max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-[#382015] pb-4 mb-4">
              <h3 className="font-cinzel text-xl font-bold text-gold-gradient">
                Saved Registrations (Mock Local Database)
              </h3>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-full hover:bg-black/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow space-y-3 pr-2">
              {registeredList.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-8">
                  No registrations recorded yet. Submit the form above to add demo delegates!
                </p>
              ) : (
                registeredList.map((item, idx) => (
                  <div key={idx} className="bg-[#1a0f0a] p-4 rounded-xl border border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.fullName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          {item.ticketId}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d96b27]/20 text-[#ff9e58] border border-[#d96b27]/40">
                          {item.paymentMode === 'cash' ? '💵 Spot Cash' : '💳 GPay'}
                        </span>
                      </div>
                      <p className="text-xs text-[#f4ece1]/80 mt-1">
                        Ward: <strong>{item.parish}</strong> • Phone: <strong>{item.phone}</strong> • Txn: <span className="font-mono text-amber-300">{item.txnRef}</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Registered: {item.dateRegistered}
                      </p>
                    </div>

                    <button
                      onClick={() => setGeneratedTicket(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#d96b27] text-white text-xs font-bold hover:bg-[#b84c0c] transition-colors"
                    >
                      View Ticket
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-[#382015] flex items-center justify-between">
              <span className="text-xs text-gray-400">Total Delegates: {registeredList.length}</span>
              {registeredList.length > 0 && (
                <button
                  onClick={handleClearDatabase}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold border border-red-500/30 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Mock DB
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
