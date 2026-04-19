import React from 'react';
import { motion } from 'motion/react';

interface LogoMarqueeProps {
  logos: string[];
}

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  if (!logos || logos.length === 0) return null;

  // Duplicate logos to ensure seamless looping
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 block mb-2">Our Trusted Partners</span>
        <h2 className="text-2xl font-bold text-gray-900">Companies Who Trust Us</h2>
      </div>

      <div className="relative">
        {/* Left/Right Overlays for Fade Effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex">
          <motion.div
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center space-x-16 whitespace-nowrap"
          >
            {marqueeLogos.map((logo, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
              >
                <img
                  src={logo}
                  alt={`Client Logo ${index}`}
                  className="h-16 w-auto max-w-[180px] object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback for missing images
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${index}/200/100?grayscale`;
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
