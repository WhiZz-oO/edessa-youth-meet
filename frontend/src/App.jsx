import React from 'react';
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

export default function App() {
  const scrollToRegister = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
    </div>
  );
}
