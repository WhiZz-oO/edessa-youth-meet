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
import ContinuousScanner from './components/ContinuousScanner';

export default function App() {
  const [directTicket, setDirectTicket] = useState(null);
  const [isAdminScannerOpen, setIsAdminScannerOpen] = useState(false);

  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    // 1. Check for Secret Admin Continuous Scanner URL (?admin=2026 or #admin2026)
    const adminKey = urlParams.get('admin') || urlParams.get('scanner') || urlParams.get('desk');
    if (adminKey === '2026' || adminKey === 'smym' || hash === '#admin2026' || hash === '#scanner') {
      setIsAdminScannerOpen(true);
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

      {/* Direct Ticket Pass Modal */}
      {directTicket && (
        <TicketModal
          ticketData={directTicket}
          onClose={() => setDirectTicket(null)}
        />
      )}

      {/* Secret Continuous Volunteer Scanner Desk */}
      {isAdminScannerOpen && (
        <ContinuousScanner
          onClose={() => setIsAdminScannerOpen(false)}
        />
      )}
    </div>
  );
}
