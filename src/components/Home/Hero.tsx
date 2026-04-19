import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Banner {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroProps {
  banners: Banner[];
}

export default function Hero({ banners }: HeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const handleNext = () => setCurrent((prev) => (prev + 1) % banners.length);
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden bg-gray-900 mt-[-80px]"> {/* Compensate for sticky navbar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={banners[current].image} 
              alt={banners[current].title}
              className="w-full h-full object-cover scale-105"
              style={{ filter: 'brightness(0.6)' }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent z-10" />

          {/* Content */}
          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 bg-brand-primary/20 backdrop-blur-md text-brand-primary rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-brand-primary/30">
                {banners[current].subtitle}
              </span>
              <h1 className="text-5xl md:text-8xl font-bold text-white leading-[0.95] mb-8 tracking-tighter">
                {banners[current].title}
              </h1>
              <div className="flex flex-wrap gap-5 mt-4">
                <Link 
                  to={banners[current].ctaLink}
                  className="px-10 py-5 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all transform hover:scale-105 shadow-2xl shadow-green-500/20"
                >
                  {banners[current].ctaText}
                </Link>
                <Link 
                  to="/about"
                  className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all"
                >
                  Our Philosophy
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dot Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${i === current ? 'w-12 bg-brand-primary' : 'w-3 bg-white/40'}`}
          />
        ))}
      </div>

      {/* Side Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-brand-primary transition-all hidden md:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-brand-primary transition-all hidden md:flex"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Bottom Visual Element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
