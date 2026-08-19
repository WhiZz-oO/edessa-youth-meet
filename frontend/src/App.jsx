import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Schedule from './components/Schedule';
import ResourcePersons from './components/ResourcePersons';
import Gallery from './components/Gallery';
import Sponsors from './components/Sponsors';
import Registration from './components/Registration';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TicketModal from './components/TicketModal';
import CheckInModal from './components/CheckInModal';
import CameraScannerModal from './components/CameraScannerModal';
import { Camera } from 'lucide-react';

export default function App() {
  const [directTicket, setDirectTicket] = useState(null);
  const [checkinData, setCheckinData] = useState(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // 1. Check for QR Code Check-In scan parameter
    const checkinId = urlParams.get('checkin');
    if (checkinId) {
      setCheckinData({
        ticketId: checkinId,
        fullName: urlParams.get('name') || 'Delegate',
        houseName: urlParams.get('house') || '—',
        parish: urlParams.get('ward') || 'Delegate',
        phone: urlParams.get('phone') || '',
        paymentMode: urlParams.get('pay') === 'online' ? 'Google Pay (UPI)' : 'Spot Cash',
      });
      return;
    }

    // 2. Check for Direct Ticket Pass view parameter
    const ticketId = urlParams.get('ticket') || urlParams.get('pass') || urlParams.get('id');
    if (ticketId) {
      const name = urlParams.get('name');
      const house = urlParams.get('house');
      const ward = urlParams.get('ward');
      const phone = urlParams.get('phone');
      const age = urlParams.get('age');
      const email = urlParams.get('email');
      const pay = urlParams.get('pay');

      if (name) {
        setDirectTicket({
          ticketId: ticketId,
          fullName: name,
          houseName: house || '—',
          parish: ward ? (ward.toLowerCase().includes('ward') ? ward : 'Ward ' + ward) : 'Delegate',
          phone: phone || '',
          age: age || '18',
          email: email || '',
          paymentMode: pay === 'online' || pay === 'gpay' ? 'Google Pay (UPI)' : 'Spot Cash',
          txnRef: urlParams.get('ref') || 'SPOT-CASH'
        });
      } else {
        const saved = localStorage.getItem('edessa_registrations');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const found = list.find(item => item.ticketId === ticketId);
            if (found) {
              setDirectTicket(found);
              return;
            }
          } catch (e) {}
        }
        
        setDirectTicket({
          ticketId: ticketId,
          fullName: 'Delegate',
          houseName: '—',
          parish: 'Delegate Pass',
          phone: '',
          age: '',
          email: '',
          paymentMode: 'Spot Cash',
          txnRef: 'SPOT-CASH'
        });
      }
    }
  }, []);

  const handleScanSuccess = (decodedText) => {
    setIsCameraScannerOpen(false);
    try {
      if (decodedText.includes('checkin=')) {
        const url = new URL(decodedText);
        const params = new URLSearchParams(url.search);
        setCheckinData({
          ticketId: params.get('checkin') || 'EDESSA-PASS',
          fullName: params.get('name') || 'Delegate',
          houseName: params.get('house') || '—',
          parish: params.get('ward') || 'Delegate',
          phone: params.get('phone') || '',
          paymentMode: params.get('pay') === 'online' ? 'Google Pay (UPI)' : 'Spot Cash',
        });
      } else {
        // Raw Ticket ID scanned
        setCheckinData({
          ticketId: decodedText.trim(),
          fullName: 'Delegate',
          houseName: '—',
          parish: 'Delegate Pass',
          phone: '',
          paymentMode: 'Spot Cash',
        });
      }
    } catch (e) {
      setCheckinData({
        ticketId: decodedText.trim(),
        fullName: 'Delegate',
        houseName: '—',
        parish: 'Delegate Pass',
        phone: '',
        paymentMode: 'Spot Cash',
      });
    }
  };

  return (
    <div className="min-h-screen bg-wood-dark text-[#f8f3eb] font-sans antialiased selection:bg-[#d96b27] selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar onOpenRegister={scrollToRegister} />

      {/* Main Page Content Sections */}
      <main>
        <Hero onOpenRegister={scrollToRegister} />
        <About />
        <Schedule />
        <ResourcePersons />
        <Gallery />
        <Sponsors />
        <Registration />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenRegister={scrollToRegister} />

      {/* Floating Volunteer QR Scanner Button */}
      <button
        onClick={() => setIsCameraScannerOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-orange-gradient text-white p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl border-2 border-[#e5c158] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs sm:text-sm cursor-pointer"
        title="Open Volunteer QR Scanner Desk"
      >
        <Camera className="w-5 h-5 text-[#ffe8aa]" />
        <span className="hidden sm:inline">Scanner Desk</span>
      </button>

      {/* Direct Ticket Pass Modal */}
      {directTicket && (
        <TicketModal
          ticketData={directTicket}
          onClose={() => setDirectTicket(null)}
        />
      )}

      {/* Check-In Attendance Verification Modal */}
      {checkinData && (
        <CheckInModal
          checkinData={checkinData}
          onClose={() => setCheckinData(null)}
        />
      )}

      {/* Volunteer Camera QR Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
