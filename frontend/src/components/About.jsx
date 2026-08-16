import React from 'react';
import { Target, Compass, HeartHandshake, Award, Cross, Users, ShieldAlert } from 'lucide-react';
import { EVENT_DETAILS } from '../data/mockData';

export default function About() {
  return (
    <section id="about" className="py-20 bg-cream-section relative overflow-hidden text-[#2a1a12]">
      
      {/* Background Subtle Motifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d96b27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4a2c1d]/10 text-[#d96b27] text-xs font-extrabold uppercase tracking-widest mb-3">
            <Cross className="w-3.5 h-3.5" />
            Discover the Movement
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-[#1c120c] mb-4">
            About <span className="text-orange-gradient font-black">EDESSA</span>
          </h2>
          <p className="font-garamond text-xl sm:text-2xl italic text-[#4a2c1d]/80">
            "Called to Witness" — Empowering young minds to shine as beacons of hope and faith.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left Feature Card (Wood Textured Highlight Container) */}
          <div className="lg:col-span-7 bg-wood-card p-8 sm:p-10 rounded-3xl text-white shadow-2xl border-2 border-[#d4af37]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-[#e5c158]">
              <Cross className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-6">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#d96b27]/20 text-[#ff9e58] text-xs font-bold tracking-wider uppercase border border-[#d96b27]/40">
                Youth Meet 2026
              </span>
              
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient leading-tight">
                A Sacred Gathering of Passion, Fellowship & Purpose
              </h3>

              <p className="text-sm sm:text-base text-[#f4ece1]/85 leading-relaxed font-light">
                <strong>EDESSA</strong> is the flagship annual youth convention organized by <strong>SMYM Chemmalamattom Unit</strong>. Bringing together youth from across the diocese, EDESSA provides an invigorating platform to celebrate culture, deepen faith, build lifelong friendships, and explore the divine calling to be true witnesses of love and justice in society.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#4a2c1d]">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-cinzel">500+</h4>
                    <p className="text-xs text-[#f4ece1]/70">Youth Delegates</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#3d2417] text-[#e5c158]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-cinzel">7+ Hours</h4>
                    <p className="text-xs text-[#f4ece1]/70">Inspiring Sessions</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Mission & Vision Stack */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Vision Card */}
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#4a2c1d]/15 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#d96b27]/10 text-[#d96b27] flex items-center justify-center mb-4 group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-cinzel text-xl font-bold text-[#1c120c] mb-2">Our Vision</h4>
              <p className="text-sm text-[#4a2c1d]/80 leading-relaxed font-normal">
                To nurture a grounded, visionary youth community equipped with moral leadership, digital ethics, and unwavering faith to transform contemporary society.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#4a2c1d]/15 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#997921] flex items-center justify-center mb-4 group-hover:bg-[#d4af37] group-hover:text-white transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-cinzel text-xl font-bold text-[#1c120c] mb-2">Our Mission</h4>
              <p className="text-sm text-[#4a2c1d]/80 leading-relaxed font-normal">
                Provide transformative keynote workshops, vibrant cultural competitions, Marian prayer, and interactive mentorship sessions for holistic youth development.
              </p>
            </div>

          </div>

        </div>

        {/* SMYM Chemmalamattom Unit Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#2a1a12] via-[#382015] to-[#2a1a12] text-white border border-[#d4af37]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-gradient p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-[#1c120c] flex items-center justify-center">
                <HeartHandshake className="w-7 h-7 text-[#e5c158]" />
              </div>
            </div>
            <div>
              <h4 className="font-cinzel text-xl font-bold text-gold-gradient">
                SMYM Chemmalamattom Unit
              </h4>
              <p className="text-xs sm:text-sm text-[#f4ece1]/80 mt-0.5 font-light">
                Syro-Malabar Youth Movement • St. Thomas Catholic Church, Chemmalamattom
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl bg-[#d96b27] hover:bg-[#b84c0c] text-white font-bold text-sm transition-all shadow-md flex-shrink-0"
          >
            Connect With SMYM Team
          </a>
        </div>

      </div>
    </section>
  );
}
