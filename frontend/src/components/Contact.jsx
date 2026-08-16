import React from 'react';
import { 
  MapPin, Phone, Mail, MessageCircle, 
  Clock, Navigation, Send, Cross 
} from 'lucide-react';
import { CONTACT_INFO, EVENT_DETAILS } from '../data/mockData';


export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-cream-section relative overflow-hidden text-[#2a1a12]">
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Venue & Direct Contacts
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            Contact & Venue Location
          </h2>
          <p className="font-garamond text-xl italic text-[#4a2c1d]/80">
            Reach out to our SMYM organizing committee or find directions to 12 Apostles Auditorium, Chemmalamattom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left Column: Contact Cards & Socials */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* Venue Location Card */}
            <div className="bg-wood-card p-6 sm:p-8 rounded-3xl text-white shadow-xl border-2 border-[#d4af37]/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-orange-gradient text-white flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#e5c158]">
                    Auditorium Venue
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-white mt-0.5">
                    12 Apostles Auditorium
                  </h3>
                  <p className="text-xs text-[#f4ece1]/80 mt-1 font-light leading-relaxed">
                    {CONTACT_INFO.location}
                  </p>

                  <a
                    href="https://maps.google.com/?q=12+Apostles+Auditorium+Chemmalamattom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#d96b27] hover:bg-[#b84c0c] text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Directions in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Organizing Contacts Grid */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#4a2c1d]/15 shadow-xl space-y-4">
              <h4 className="font-cinzel text-base font-bold text-[#1c120c] uppercase tracking-wider border-b border-[#4a2c1d]/15 pb-2">
                SMYM Organizing Leads
              </h4>

              <div className="space-y-3">
                {CONTACT_INFO.contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#4a2c1d]/10 hover:border-[#d96b27] transition-all">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#d96b27]">
                        {contact.title}
                      </p>
                      <p className="text-sm font-bold text-[#1c120c]">{contact.name}</p>
                    </div>

                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="p-2.5 rounded-xl bg-[#2a1a12] text-[#e5c158] hover:bg-[#d96b27] hover:text-white transition-colors"
                      title="Call Now"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gradient-to-r from-[#2a1a12] to-[#382015] p-6 rounded-3xl text-white border border-[#d4af37]/30 shadow-xl flex items-center justify-between">
              <div>
                <h4 className="font-cinzel text-sm font-bold text-gold-gradient">
                  Follow SMYM Chemmalamattom
                </h4>
                <p className="text-xs text-[#f4ece1]/70 mt-0.5">Stay connected for live updates</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={CONTACT_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#1c120c] hover:bg-[#d96b27] text-white transition-colors border border-[#d4af37]/20"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href={CONTACT_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#1c120c] hover:bg-green-600 text-white transition-colors border border-[#d4af37]/20"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                <a
                  href={CONTACT_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#1c120c] hover:bg-red-600 text-white transition-colors border border-[#d4af37]/20"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-7 bg-wood-card rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl flex flex-col min-h-[400px]">
            <div className="p-4 bg-[#1a0f0a] border-b border-[#382015] flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#e5c158]" />
                <span className="font-cinzel text-xs font-bold text-white tracking-wider uppercase">
                  Auditorium Interactive Map
                </span>
              </div>
              <span className="text-[10px] text-[#ff9e58] font-mono font-bold">
                Chemmalamattom, Kerala
              </span>
            </div>

            {/* Google Map iframe */}
            <div className="flex-grow w-full relative min-h-[350px]">
              <iframe
                title="12 Apostles Auditorium Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.284394982618!2d76.7725843!3d9.6563721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07ce4a5db2293f%3A0x6b8408cf5796277b!2s12%20Apostles%20Auditorium%2C%20Chemmalamattom!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 absolute inset-0 filter saturate-90 contrast-105"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
