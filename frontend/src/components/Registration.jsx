import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Upload, FileImage, ShieldCheck, QrCode, 
  Sparkles, User, Phone, MapPin, Mail, Calendar, Eye, Trash2, Cross 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS } from '../data/mockData';
import TicketModal from './TicketModal';

export default function Registration({ isOpen, onClose }) {
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
  const [registeredList, setRegisteredList] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Load existing registrations from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('edessa_registrations');
      if (saved) {
        setRegisteredList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse saved registrations", e);
    }
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload & Screenshot Verification
  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setVerificationError('Please select a valid image file (PNG, JPG, JPEG)');
      setIsVerified(false);
      return;
    }

    setScreenshotFile(file);
    setVerificationError('');
    setIsVerifying(true);
    setIsVerified(false);

    // Read Image Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
      
      // Simulate GPay Screenshot Verification Check
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        // Generate mock transaction reference ID
        const randomTxn = 'GPAY-' + Math.floor(100000000000 + Math.random() * 900000000000);
        setTxnRef(randomTxn);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isVerified) {
      setVerificationError('GPay payment screenshot verification is required before submission.');
      return;
    }

    const newTicketId = 'EDESSA-2026-' + Math.floor(1000 + Math.random() * 9000);

    const registrationRecord = {
      id: Date.now(),
      ticketId: newTicketId,
      fullName: formData.fullName,
      phone: formData.phone,
      parish: formData.parish,
      age: formData.age,
      email: formData.email,
      txnRef: txnRef,
      screenshotPreview: screenshotPreview,
      dateRegistered: new Date().toLocaleString(),
    };

    // Save to Local Mock Database
    const updatedList = [registrationRecord, ...registeredList];
    setRegisteredList(updatedList);
    try {
      localStorage.setItem('edessa_registrations', JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Storage quota limit reached for image previews", e);
    }

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Set generated ticket to launch Ticket Modal
    setGeneratedTicket(registrationRecord);

    // Reset Form
    setFormData({ fullName: '', phone: '', parish: '', age: '', email: '' });
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setIsVerified(false);
  };

  // Clear mock database
  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all mock registrations stored in browser?")) {
      localStorage.removeItem('edessa_registrations');
      setRegisteredList([]);
    }
  };

  return (
    <section id="register" className="py-20 bg-wood-dark relative overflow-hidden text-white">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#d96b27]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d2417] text-[#e5c158] text-xs font-bold uppercase tracking-widest border border-[#d4af37]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#ffe8aa]" />
            Official Registration
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient mb-4">
            Register for EDESSA 2026
          </h2>
          <p className="text-sm sm:text-base text-[#f4ece1]/80 max-w-xl mx-auto font-light">
            Complete the details below, transfer the ₹150 registration fee via GPay/UPI, and upload your payment screenshot to receive your delegate pass.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: GPay Payment QR & Instructions */}
          <div className="lg:col-span-5 bg-wood-card p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/30 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#382015] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d96b27]">
                  Step 1: Payment
                </span>
                <h3 className="font-cinzel text-xl font-bold text-white">GPay / UPI Payment</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#d96b27] text-white">
                ₹150
              </span>
            </div>

            {/* Payment Details Box */}
            <div className="bg-[#1a0f0a] p-4 rounded-2xl border border-[#d4af37]/20 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#e5c158]">UPI ID</p>
                <p className="font-mono text-sm text-white font-bold tracking-wider">
                  {EVENT_DETAILS.gpayUpiId}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-[#e5c158]">GPay Contact Number</p>
                <p className="font-mono text-sm text-[#ff9e58] font-bold">
                  {EVENT_DETAILS.gpayNumber}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-[#e5c158]">Beneficiary Name</p>
                <p className="text-xs text-[#f4ece1] font-semibold">
                  SMYM Chemmalamattom Unit
                </p>
              </div>
            </div>

            {/* QR Code Graphic Box */}
            <div className="p-4 bg-white rounded-2xl shadow-xl text-center border-2 border-[#e5c158] flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-[#150d09]" />
              <p className="text-xs font-bold text-[#150d09] mt-2 font-cinzel">
                Scan & Pay ₹150 via GPay / PhonePe / Paytm
              </p>
              <p className="text-[10px] text-gray-600">
                Take a screenshot of the completed payment
              </p>
            </div>

            <div className="text-xs text-[#f4ece1]/70 space-y-1 font-light">
              <p>📌 Note: Screenshot must clearly show Transaction ID or Ref number.</p>
              <p>📌 Only registrations with verified payment screenshots will be approved.</p>
            </div>

            {/* Admin Viewer Button */}
            <div className="pt-4 border-t border-[#382015]">
              <button
                type="button"
                onClick={() => setShowAdminModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#1c120c] hover:bg-[#382015] text-[#e5c158] text-xs font-bold border border-[#d4af37]/30 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#d96b27]" />
                View Saved Submissions ({registeredList.length})
              </button>
            </div>

          </div>

          {/* Right Column: Main Registration Form */}
          <div className="lg:col-span-7 bg-wood-card p-6 sm:p-8 rounded-3xl border-2 border-[#d4af37]/30 shadow-2xl">
            
            <div className="border-b border-[#382015] pb-4 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d96b27]">
                Step 2: Delegate Information & Verification
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white">Fill Registration Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#e5c158]/60" />
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

              {/* Phone & Age Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#e5c158]/60" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
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

              {/* Parish / Unit */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Parish / SMYM Unit <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Cross className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#e5c158]/60" />
                  <input
                    type="text"
                    name="parish"
                    required
                    value={formData.parish}
                    onChange={handleChange}
                    placeholder="e.g. Chemmalamattom / Palai Parish"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a0f0a] border border-[#d4af37]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#d96b27] text-sm"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#e5c158] mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#e5c158]/60" />
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

              {/* GPay Screenshot Upload Area */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isVerified}
                className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 shadow-xl border flex items-center justify-center gap-2 ${
                  isVerified
                    ? 'bg-orange-gradient text-white border-[#e5c158]/60 shadow-[#d96b27]/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-[#2a1a12] text-gray-500 border-[#382015] cursor-not-allowed opacity-70'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                {isVerified ? 'Confirm & Generate Delegate Ticket' : 'Upload GPay Screenshot to Register'}
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
                <X className="w-6 h-6" />
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
                      </div>
                      <p className="text-xs text-[#f4ece1]/80 mt-1">
                        Parish: <strong>{item.parish}</strong> • Phone: <strong>{item.phone}</strong> • Txn: <span className="font-mono text-amber-300">{item.txnRef}</span>
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

