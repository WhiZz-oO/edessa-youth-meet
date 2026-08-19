import React, { useState } from 'react';
import { 
  CheckCircle, ShieldCheck, Sparkles, User, Phone, MapPin, Mail, 
  Banknote, Loader2, Home, Calendar, Clock, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GOOGLE_SHEETS_CONFIG } from '../data/googleSheetsConfig';
import TicketModal from './TicketModal';

export default function Registration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    houseName: '',
    phone: '',
    parish: '',
    age: '',
    email: '',
  });

  const [generatedTicket, setGeneratedTicket] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      fullName: formData.fullName.trim(),
      houseName: formData.houseName.trim(),
      phone: formData.phone.trim(),
      parish: formData.parish.trim(), // Ward
      age: formData.age.trim(),
      email: formData.email.trim(),
      paymentMode: 'Spot Cash',
      txnRef: 'SPOT-CASH',
      dateRegistered: dateFormatted,
      screenshotData: '',
      screenshotName: '',
    };

    // Dual-Channel Submission to Google Sheets
    if (GOOGLE_SHEETS_CONFIG.webAppUrl && !GOOGLE_SHEETS_CONFIG.webAppUrl.includes('REPLACE_WITH')) {
      try {
        // Channel 1: standard no-cors fetch
        await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(newEntry),
        });
      } catch (err) {
        console.warn('Direct fetch warning:', err);
      }

      // Channel 2: Background hidden form submit (100% bypasses CORS & ad-blockers)
      try {
        const iframeName = 'sheets_hidden_iframe_' + Date.now();
        let iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEETS_CONFIG.webAppUrl;
        form.target = iframeName;
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(newEntry);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();

        setTimeout(() => {
          try {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
          } catch (e) {}
        }, 5000);
      } catch (err) {
        console.warn('Iframe fallback warning:', err);
      }
    }

    // Save locally
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
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
    });

    setGeneratedTicket(newEntry);

    // Reset form
    setFormData({ fullName: '', houseName: '', phone: '', parish: '', age: '', email: '' });
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
            Fill your details below to register and download your official Delegate Pass (Spot Cash Payment at Venue)
          </p>
        </div>

        {/* Form & Info Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Event & Spot Payment Guidelines */}
          <div className="lg:col-span-5 bg-[#1c120c] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-6">
            
            {/* Header info badge */}
            <div className="flex items-center justify-between border-b border-[#382015] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Payment Mode</span>
                <h3 className="font-cinzel text-xl font-bold text-white">Spot Cash (Pay at Desk)</h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#e5c158] text-[#1c120c] shadow-md">
                ₹150
              </span>
            </div>

            {/* Main info card */}
            <div className="py-6 px-5 rounded-2xl bg-[#2a1a12] border border-[#d4af37]/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#3d2417] text-[#e5c158] flex items-center justify-center mx-auto text-3xl shadow-inner border border-[#d4af37]/40">
                <Banknote className="w-8 h-8 text-[#e5c158]" />
              </div>

              <div>
                <h4 className="font-cinzel text-lg font-bold text-gold-gradient">
                  Pay at Registration Counter
                </h4>
                <p className="text-xs text-[#f4ece1]/80 mt-2 leading-relaxed">
                  Register online now to reserve your seat and generate your <strong className="text-[#e5c158]">Official Delegate Pass</strong>. You can pay the registration fee of <strong className="text-[#e5c158]">₹150 in cash</strong> at the counter upon arrival.
                </p>
              </div>

              {/* Benefits list */}
              <div className="p-3.5 rounded-xl bg-[#1c120c] border border-[#4a2c1d] text-left text-xs text-[#f4ece1]/80 space-y-2">
                <p className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Instant Delegate Pass with Unique ID</span>
                </p>
                <p className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>No UPI app or screenshot upload needed</span>
                </p>
                <p className="flex items-center gap-2 text-[#ff9e58] font-semibold">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Direct submission to event database</span>
                </p>
              </div>
            </div>

            {/* Event Schedule Info */}
            <div className="p-4 rounded-2xl bg-[#2a1a12] border border-[#4a2c1d] space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#e5c158] font-bold">
                <Calendar className="w-4 h-4 text-[#d96b27]" />
                <span>25 August 2026 • Tuesday</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#f4ece1]/85">
                <Clock className="w-4 h-4 text-[#d96b27]" />
                <span>10:00 AM Onwards</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#f4ece1]/85">
                <MapPin className="w-4 h-4 text-[#d96b27]" />
                <span>12 Apostles Auditorium, Chemmalamattom</span>
              </div>
            </div>

            {/* Venue instructions */}
            <div className="p-3.5 rounded-xl bg-[#2a1a12]/60 border border-[#4a2c1d] text-[11px] text-[#f4ece1]/70 leading-relaxed">
              <p>💡 <strong>Note:</strong> After registering, save or screenshot your digital ticket pass and present it at the registration counter on the day of the event.</p>
            </div>

          </div>

          {/* Right Column: Delegate Information Form */}
          <div className="lg:col-span-7 bg-[#1c120c] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
            
            <div className="border-b border-[#382015] pb-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d96b27]">Delegate Information</span>
              <h3 className="font-cinzel text-xl font-bold text-white">Fill Registration Details</h3>
            </div>

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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 shadow-xl border flex items-center justify-center gap-2 bg-orange-gradient text-white border-[#e5c158]/60 shadow-[#d96b27]/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Registration to Database...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Confirm Registration &amp; Generate Delegate Pass</span>
                    </>
                  )}
                </button>
              </div>

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
