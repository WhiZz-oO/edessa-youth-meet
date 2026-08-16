import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-[#120a06] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5c158]/10 text-[#e5c158] text-xs font-extrabold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Connect With Us
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Venue & Contact Info
          </h2>
          <p className="font-garamond text-xl italic text-[#f4ece1]/70">
            Reach out to our organizing team or find your way to the venue
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Details */}
          <div className="space-y-8">
            {/* Leadership Contacts */}
            <div className="bg-[#1c120c] p-8 rounded-3xl border border-[#d4af37]/20 shadow-xl space-y-6">
              <h3 className="font-cinzel text-2xl font-bold text-gold-gradient mb-4">
                Organizing Committee
              </h3>
              <div className="space-y-4">
                {CONTACT_INFO.contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[#2a1a12]/60 border border-[#4a2c1d] hover:border-[#d96b27]/50 transition-colors">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#d96b27] font-bold">{contact.title}</p>
                      <p className="font-cinzel font-semibold text-lg text-white">{contact.name}</p>
                    </div>
                    <a
                      href={'tel:' + contact.phone}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3d2417] text-[#e5c158] hover:bg-[#d96b27] hover:text-white transition-colors text-sm font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="pt-4 border-t border-[#4a2c1d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#3d2417] text-[#e5c158]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#f4ece1]/60 font-semibold">Email Us</p>
                    <p className="text-sm font-medium text-white">{CONTACT_INFO.email}</p>
                  </div>
                </div>
                <a
                  href={'mailto:' + CONTACT_INFO.email}
                  className="text-xs text-[#e5c158] hover:underline font-semibold"
                >
                  Send Message
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="bg-[#1c120c] p-6 rounded-3xl border border-[#d4af37]/20 flex items-center justify-between">
              <span className="font-cinzel font-bold text-sm text-[#f4ece1]">Follow SMYM Unit</span>
              <div className="flex items-center gap-3">
                <a href={CONTACT_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#2a1a12] text-[#f4ece1] hover:text-[#d96b27] hover:bg-[#3d2417] transition-all" title="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href={CONTACT_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#2a1a12] text-[#f4ece1] hover:text-[#d96b27] hover:bg-[#3d2417] transition-all" title="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
                <a href={CONTACT_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#2a1a12] text-[#f4ece1] hover:text-[#d96b27] hover:bg-[#3d2417] transition-all" title="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Venue Map */}
          <div className="bg-[#1c120c] p-8 rounded-3xl border border-[#d4af37]/20 shadow-xl flex flex-col h-full justify-between space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-bold text-gold-gradient">
                    Event Venue
                  </h3>
                  <p className="text-sm text-[#f4ece1]/80 mt-1">
                    {CONTACT_INFO.location}
                  </p>
                </div>
                <a
                  href={CONTACT_INFO.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-gradient text-white text-xs font-bold hover:scale-105 transition-transform"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Embed */}
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#4a2c1d] relative">
                <iframe
                  title="Venue Location Map"
                  src="https://maps.google.com/maps?q=12+Apostles+Auditorium+Chemmalamattom+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#2a1a12]/80 border border-[#4a2c1d] flex items-center justify-between text-xs">
              <span className="text-[#f4ece1]/70">12 Apostles Auditorium, Chemmalamattom</span>
              <a
                href={CONTACT_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e5c158] font-bold hover:underline flex items-center gap-1"
              >
                Get Directions &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
