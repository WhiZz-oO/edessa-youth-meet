import React, { useState } from 'react';
import { Camera, Play, X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['All', 'Highlights', 'Spiritual', 'Cultural', 'Sessions'];

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (item, index) => {
    setSelectedMedia(item);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIdx);
    setSelectedMedia(filteredItems[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prevIdx);
    setSelectedMedia(filteredItems[prevIdx]);
  };

  return (
    <section id="gallery" className="py-20 bg-wood-dark relative overflow-hidden text-white">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#d96b27]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3d2417] text-[#e5c158] text-xs font-bold uppercase tracking-widest border border-[#d4af37]/30 mb-3">
            <Camera className="w-3.5 h-3.5" />
            Memories & Moments
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-gold-gradient mb-4">
            Event Gallery
          </h2>
          <p className="text-sm sm:text-base text-[#f4ece1]/80 max-w-xl mx-auto font-light">
            Glimpses of vibrant youth fellowship, Onam cultural festivities, and Marian prayer moments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-orange-gradient text-white shadow-lg border border-[#e5c158]/60 scale-105'
                  : 'bg-[#2a1a12] text-[#f4ece1]/70 hover:text-white hover:bg-[#382015] border border-[#d4af37]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item, index)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-xl cursor-pointer bg-wood-card"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#150d09] via-[#150d09]/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Media Icon Badge */}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-[#150d09]/80 text-[#e5c158] border border-[#e5c158]/30 group-hover:bg-[#d96b27] group-hover:text-white transition-colors">
                {item.type === 'video' ? <Play className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </div>

              {/* Title & Caption Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff9e58] bg-[#d96b27]/20 px-2.5 py-0.5 rounded border border-[#d96b27]/30">
                  {item.category}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white mt-1 group-hover:text-[#e5c158] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#f4ece1]/80 mt-1 line-clamp-1 font-light">
                  {item.caption}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          
          {/* Close Button */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#2a1a12] text-white hover:bg-[#d96b27] transition-colors border border-[#d4af37]/40 z-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#2a1a12]/80 text-white hover:bg-[#d96b27] transition-colors border border-[#d4af37]/40 z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#2a1a12]/80 text-white hover:bg-[#d96b27] transition-colors border border-[#d4af37]/40 z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Media Lightbox Card */}
          <div className="max-w-4xl w-full max-h-[85vh] bg-wood-card rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl flex flex-col">
            <div className="relative flex-grow bg-black overflow-hidden flex items-center justify-center min-h-[300px]">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="max-h-[65vh] w-auto object-contain mx-auto"
              />
            </div>
            
            <div className="p-6 bg-[#1a0f0a] border-t border-[#382015] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#e5c158] tracking-wider">
                  {selectedMedia.category}
                </span>
                <h4 className="font-cinzel text-xl font-bold text-white mt-0.5">
                  {selectedMedia.title}
                </h4>
                <p className="text-xs text-[#f4ece1]/80 mt-1">
                  {selectedMedia.caption}
                </p>
              </div>

              <span className="text-xs text-[#f4ece1]/60 font-mono">
                {currentIndex + 1} of {filteredItems.length}
              </span>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
