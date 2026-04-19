import React from 'react';
import { motion } from 'motion/react';

interface LogoMarqueeProps {
  logos: string[];
}

export default function LogoMarquee({ logos }: LogoMarqueeProps) {
  if (!logos || logos.length === 0) return null;

  // Split logos into two rows for a more dynamic look
  const row1 = logos.slice(0, Math.ceil(logos.length / 2));
  const row2 = logos.slice(Math.ceil(logos.length / 2));

  // Triplicate to ensure smooth loop
  const marqueeLogos1 = [...row1, ...row1, ...row1];
  const marqueeLogos2 = [...row2, ...row2, ...row2];

  const Row = ({ items, direction = 'left' }: { items: string[], direction?: 'left' | 'right' }) => (
    <div className="flex mb-8">
      <motion.div
        animate={{ x: direction === 'left' ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex items-center space-x-12 whitespace-nowrap"
      >
        {items.map((logo, index) => (
          <div 
            key={index} 
            className="logo-card flex items-center justify-center p-6 bg-white shadow-md hover:shadow-2xl transition-all duration-500"
            style={{ minWidth: '240px', height: '120px' }}
          >
            <img
              src={logo}
              alt={`Partner ${index}`}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm hover:scale-110 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=Brand${index}&backgroundColor=ddd`;
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
        <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
          Trusted Worldwide
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Companies Who <span className="text-brand-secondary">Trust Us</span>
        </h2>
        <div className="w-16 h-1 w-16 bg-brand-primary mx-auto mt-6 rounded-full" />
      </div>

      <div className="relative z-10">
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-gray-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-gray-50 to-transparent z-20 pointer-events-none" />

        <Row items={marqueeLogos1} direction="left" />
        <Row items={marqueeLogos2} direction="right" />
      </div>
    </section>
  );
}
