import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Upload, FileImage, ShieldCheck, 
  Sparkles, User, Phone, MapPin, Mail, Calendar, Cross,
  CreditCard, Banknote, HelpCircle, ArrowRight, Copy, Check, ExternalLink,
  Loader2, Home, Image, Key, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Tesseract from 'tesseract.js';
import { EVENT_DETAILS } from '../data/mockData';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';
import TicketModal from './TicketModal';
import gpayQr from '../assets/gpay-qr.png';

export default function Registration({ isOpen, onClose }) {
  const [paymentMode, setPaymentMode] = useState('gpay'); // 'gpay' or 'cash'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    houseName: '',
    phone: '',
    parish: '',
    age: '',
    email: '',
  });

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [payeeVerified, setPayeeVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Existing database Transaction IDs for duplicate protection
  const [usedTxnIds, setUsedTxnIds] = useState([]);

  const upiPayUrl = `upi://pay?pa=${EVENT_DETAILS.gpayUpiId}&pn=Anwin%20C%20M&am=150&cu=INR&tn=EDESSA%202026%20Registration`;

  // Fetch all existing transaction IDs from Google Sheet + LocalStorage on mount
  const fetchExistingTransactions = async () => {
    let localTxns = [];
    const saved = localStorage.getItem('edessa_registrations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        localTxns = parsed.map(item => String(item.txnRef || '').trim()).filter(Boolean);
      } catch (e) {
        console.error('Failed to parse registrations', e);
      }
    }

    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        const res = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl);
        const data = await res.json();
        if (data && data.txns && Array.isArray(data.txns)) {
          const combined = Array.from(new Set([...localTxns, ...data.txns.map(t => String(t).trim())]));
          setUsedTxnIds(combined);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch remote txns:', err);
      }
    }
    setUsedTxnIds(localTxns);
  };

  useEffect(() => {
    fetchExistingTransactions();
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
    setDuplicateError('');
    if (mode === 'cash') {
      setIsVerified(true);
      setTxnRef('CASH-DESK');
    } else {
      if (!txnRef || txnRef === 'CASH-DESK') {
        setIsVerified(false);
        setTxnRef('');
      }
    }
  };

  // Compress image
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedData = canvas.toDataURL('image/jpeg', 0.85);
        callback(compressedData);
      };
    };
  };

  // Validate Transaction ID for duplicates
  const checkDuplicate = (idToCheck) => {
    if (!idToCheck || idToCheck === 'SPOT-CASH' || idToCheck === 'CASH-DESK') return false;
    const cleanId = String(idToCheck).trim();
    return usedTxnIds.includes(cleanId);
  };

  const handleTxnChange = (value) => {
    const cleanVal = value.trim();
    setTxnRef(cleanVal);
    setDuplicateError('');

    if (!cleanVal) {
      setIsVerified(false);
      return;
    }

    if (checkDuplicate(cleanVal)) {
      setDuplicateError(`❌ Duplicate Detected: Transaction ID (${cleanVal}) has already been registered in the system!`);
      setIsVerified(false);
      return;
    }

    if (payeeVerified && cleanVal.length >= 8) {
      setIsVerified(true);
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
    setDuplicateError('');
    setIsVerified(false);
    setPayeeVerified(false);
    setTxnRef('');
    setOcrProgress(0);

    compressImage(file, (compressedBase64) => {
      setScreenshotPreview(compressedBase64);
      setScreenshotBase64(compressedBase64);
      performOcrVerification(compressedBase64);
    });
  };

  const performOcrVerification = async (imageSource) => {
    setIsVerifying(true);
    setVerificationError('');
    setDuplicateError('');

    try {
      const { data: { text } } = await Tesseract.recognize(imageSource, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      setIsVerifying(false);
      const textLower = text.toLowerCase();

            // Check 1: Recipient Verification (Anwin C M / UPI handle / phone)
      const hasPayeeMatch = 
        textLower.includes('anwin') || 
        textLower.includes('8921332098') || 
        textLower.includes('okbizaxis') || 
        textLower.includes('8921') ||
        textLower.includes('edessa');

      if (!hasPayeeMatch) {
        setVerificationError(
          'Screenshot Invalid: Payment recipient must be Anwin C M (8921332098@okbizaxis).'
        );
        setPayeeVerified(false);
        setIsVerified(false);
        return;
      }

      setPayeeVerified(true);

      // Check 2: Extract 12-digit UPI Transaction ID or Google Txn ID
      // Extract 12-digit UPI Transaction ID from Paytm, GPay, PhonePe, BHIM, etc.
      let detectedTxn = '';
      
      // Pattern A: Contiguous 12 digits
      const match12 = text.match(/\b\d{12}\b/);
      if (match12) {
        detectedTxn = match12[0];
      } 
      // Pattern B: Paytm 4-4-4 grouped format (e.g. 3127 3604 2481)
      else if (text.match(/\b\d{4}\s+\d{4}\s+\d{4}\b/)) {
        detectedTxn = text.match(/\b\d{4}\s+\d{4}\s+\d{4}\b/)[0].replace(/\s+/g, '');
      }
      // Pattern C: Ref No / UTR / RRN prefixes
      else if (text.match(/(?:ref\s*(?:no|num|number)?|upi\s*ref|rrn|txn\s*(?:id|no)?|utr)[:.\s]*([0-9\s]{12,18})/i)) {
        const refMatch = text.match(/(?:ref\s*(?:no|num|number)?|upi\s*ref|rrn|txn\s*(?:id|no)?|utr)[:.\s]*([0-9\s]{12,18})/i);
        detectedTxn = refMatch[1].replace(/\s+/g, '').slice(0, 12);
      }
      // Pattern D: Google Pay transaction strings (CICAg...)
      else if (text.match(/CICAg[a-zA-Z0-9_-]+/)) {
        detectedTxn = text.match(/CICAg[a-zA-Z0-9_-]+/)[0];
      }
      // Pattern E: Any 12 digits in the text stream
      else {
        const rawDigits = text.replace(/[^0-9]/g, '');
        const any12 = rawDigits.match(/\d{12}/);
        if (any12) {
          detectedTxn = any12[0];
        }
      }

      if (detectedTxn) {
        setTxnRef(detectedTxn);

        // Check 3: Immediate Duplicate Validation
        if (checkDuplicate(detectedTxn)) {
          setDuplicateError(
            `Duplicate Payment Blocked: Transaction ID (${detectedTxn}) has already been used for registration!`
          );
          setIsVerified(false);
          return;
        }

        setIsVerified(true);
      } else {
        // If OCR could not read 12 digits automatically, prompt user to enter the exact 12 digits
        setVerificationError(
          'Could not auto-read 12-digit UPI ID from image. Please type the 12-digit Transaction ID shown on your screenshot below.'
        );
        setIsVerified(false);
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setIsVerifying(false);
      setVerificationError('Could not process image text. Please enter the 12-digit UPI Transaction ID below.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMode === 'gpay') {
      if (!txnRef || txnRef.length < 8) {
        setVerificationError('Please provide a valid UPI Transaction ID (12 digits).');
        return;
      }

      if (checkDuplicate(txnRef)) {
        setDuplicateError(`Duplicate Payment Blocked: Transaction ID (${txnRef}) has already been used!`);
        return;
      }
    }

    setIsSubmitting(true);
    setDuplicateError('');

    const newTicketId = 'EDESSA-2026-' + Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newEntry = {
      ticketId: newTicketId,
      fullName: formData.fullName,
      houseName: formData.houseName,
      phone: formData.phone,
      parish: formData.parish, // Ward
      age: formData.age,
      email: formData.email,
      paymentMode: paymentMode === 'cash' ? 'Spot Cash' : 'Google Pay (UPI)',
      txnRef: paymentMode === 'cash' ? 'SPOT-CASH' : txnRef,
      dateRegistered: dateFormatted,
      screenshotData: paymentMode === 'gpay' ? screenshotBase64 : '',
      screenshotName: `${newTicketId}_${formData.fullName.replace(/\s+/g, '_')}.jpg`,
    };

    // Send to Google Sheets (mode: 'no-cors' is REQUIRED for Google Apps Script Web App in browsers)
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(newEntry),
        });
      } catch (err) {
        console.error('Google Sheets submission error:', err);
      }
    }

    // Save locally and add to usedTxnIds
    if (paymentMode === 'gpay') {
      setUsedTxnIds(prev => [...prev, txnRef]);
    }
    const saved = localStorage.getItem('edessa_registrations');
    let currentList = [];
    if (saved) {
      try {
        currentList = JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.setItem('edessa_registrations', JSON.stringify([newEntry, ...currentList]));

    setIsSubmitting(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setGeneratedTicket(newEntry);

    // Reset form
    setFormData({ fullName: '', houseName: '', phone: '', parish: '', age: '', email: '' });
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotBase64('');
    if (paymentMode === 'gpay') {
      setIsVerified(false);
      setPayeeVerified(false);
      setTxnRef('');
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
                    <img src={gpayQr} alt="GPay UPI QR Code - 8921332098@okbizaxis" className="w-full h-full object-contain rounded-xl" />
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
                      Anwin C M (SMYM Secretary)
                    </p>
                  </div>
                </div>

                {/* Verification Note */}
                <div className="p-3 rounded-xl bg-[#2a1a12]/60 border border-[#4a2c1d] text-[11px] text-[#f4ece1]/70 space-y-1">
                  <p>🔒 <strong>Anti-Fraud Shield Active:</strong> Each 12-digit UPI Transaction ID is verified and can only be used once.</p>
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

          </div>

          {/* Right Column: Delegate Information Form */}
          <div className="lg:col-span-7 bg-[#1c120c] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
            
            <div className="border-b border-[#382015] pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Step 2: Information</span>
              <h3 className="font-cinzel text-xl font-bold text-white">Fill Registration Details</h3>
            </div>

            {/* Duplicate Error Banner */}
            {duplicateError && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-200 text-xs flex items-start gap-3 shadow-lg animate-bounce">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-400 text-sm">❌ Duplicate Payment Rejected</p>
                  <p className="mt-1 font-semibold leading-relaxed">{duplicateError}</p>
                  <p className="text-[11px] text-red-300/90 mt-1">This transaction ID has already been recorded for a previous registration. Each payment screenshot can only be used once.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name & House Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    House Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-[#e5c158] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="houseName"
                      required
                      value={formData.houseName}
                      onChange={handleChange}
                      placeholder="Enter your house name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                    />
                  </div>
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
                    <option value="">Select your Ward (01 – 30)</option>
                    {Array.from({ length: 30 }, (_, i) => {
                      const wardNum = String(i + 1).padStart(2, '0');
                      return (
                        <option key={i + 1} value={`Ward ${wardNum}`}>
                          Ward {wardNum}
                        </option>
                      );
                    })}
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
                <div className="pt-2 space-y-3">
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    Upload GPay Payment Screenshot <span className="text-red-400">*</span>
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
                          className="w-20 h-24 object-cover rounded-xl border border-[#e5c158] shadow-md flex-shrink-0"
                        />
                        <div className="space-y-1.5 flex-grow">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {screenshotFile?.name}
                          </p>
                          
                          {isVerifying && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Scanning payment details via AI OCR... ({ocrProgress}%)</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#2a1a12] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-orange-gradient transition-all duration-300 rounded-full"
                                  style={{ width: `${Math.max(10, ocrProgress)}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {payeeVerified && (
                            <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/30">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span>Paid to Anwin C M Verified!</span>
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
                          AI will verify payment to <strong>8921332098@okbizaxis</strong> and detect 12-digit UPI Txn ID
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Read-Only Verified UPI Transaction ID Display */}
                  {txnRef && (
                    <div className="p-3.5 rounded-2xl bg-[#1a0f0a] border border-green-500/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold uppercase text-[#e5c158] flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-green-400" />
                          <span>Extracted UPI Transaction ID (Read-Only)</span>
                        </label>
                        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          🔒 Verified
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={txnRef}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1a12] border border-green-500/40 text-green-400 font-mono text-xs cursor-not-allowed select-all focus:outline-none opacity-90"
                        />
                      </div>
                      <p className="text-[10px] text-[#f4ece1]/60">
                        Auto-extracted from your uploaded payment screenshot.
                      </p>
                    </div>
                  )}

                  {verificationError && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{verificationError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !!duplicateError || (paymentMode === 'gpay' && (!isVerified || !txnRef))}
                className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 shadow-xl border flex items-center justify-center gap-2 ${
                  !duplicateError && (paymentMode === 'cash' || (isVerified && txnRef))
                    ? 'bg-orange-gradient text-white border-[#e5c158]/60 shadow-[#d96b27]/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-[#2a1a12] text-gray-500 border-[#382015] cursor-not-allowed opacity-70'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Duplicates & Saving Registration...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>
                      {duplicateError
                        ? 'Duplicate Payment - Cannot Submit'
                        : paymentMode === 'cash'
                        ? 'Confirm Registration (Spot Cash)'
                        : isVerified && txnRef
                        ? 'Confirm & Generate Delegate Ticket'
                        : 'Upload Valid GPay Screenshot to Register'}
                    </span>
                  </>
                )}
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

    </section>
  );
}
