import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ShieldCheck, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Hero from '../components/Home/Hero';
import LogoMarquee from '../components/Home/LogoMarquee';

const services = [
  {
    title: "Accounting",
    desc: "Comprehensive financial reporting and bookkeeping for your business.",
    icon: Briefcase
  },
  {
    title: "Tax Consulting",
    desc: "Optimized tax planning and compliance to maximize your earnings.",
    icon: ShieldCheck
  },
  {
    title: "Internal Auditing",
    desc: "Rigorous internal controls to ensure transparency and accuracy.",
    icon: TrendingUp
  },
  {
    title: "Management Consultancy",
    desc: "Strategic advice to scale your operations and efficiency.",
    icon: Users
  }
];

const DEFAULT_BANNERS = [
  {
    title: "Empowering Your Business Growth",
    subtitle: "Strategic Consultancy",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    ctaText: "Explore Services",
    ctaLink: "/hire"
  },
  {
    title: "Expert Doctors for Financial Health",
    subtitle: "Accuracy & Compliance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
    ctaText: "Consult Now",
    ctaLink: "/contact"
  },
  {
    title: "Global Standards, Local Expertise",
    subtitle: "Professional Excellence",
    image: "https://images.unsplash.com/photo-1573161559525-4607c60f438a?q=80&w=2069&auto=format&fit=crop",
    ctaText: "About Our Team",
    ctaLink: "/about"
  }
];

const DEFAULT_LOGOS = [
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_0.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_1.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_2.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_3.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_4.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_5.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_6.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745074872620_input_file_7.png?alt=media",
];

export default function Home() {
  const [config, setConfig] = useState<any>({
    banners: DEFAULT_BANNERS,
    clientLogos: DEFAULT_LOGOS,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setConfig((prev: any) => ({
          ...prev,
          banners: data.banners || DEFAULT_BANNERS,
          clientLogos: data.clientLogos || DEFAULT_LOGOS,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Animated Hero Section */}
      <Hero banners={config.banners} />

      {/* Partners Marquee */}
      <LogoMarquee logos={config.clientLogos} />

      {/* Services Grid */}
      <section className="py-24 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our <span className="text-brand-secondary">Specialized</span> Services</h2>
            <p className="text-gray-600 text-lg">We offer a full suite of professional services designed to maintain compliance and drive strategic growth for SMEs and Corporations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-gray-50 rounded-3xl hover:bg-brand-primary hover:text-white transition-all group cursor-pointer"
              >
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-white/10 group-hover:text-white transition-colors">
                  <s.icon className="h-7 w-7 text-brand-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed mb-6">{s.desc}</p>
                <Link to="/hire" className="inline-flex items-center text-sm font-bold group-hover:underline">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <h3 className="text-5xl font-bold mb-2">500+</h3>
              <p className="text-sm uppercase tracking-widest font-medium opacity-70">Clients Served</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">15+</h3>
              <p className="text-sm uppercase tracking-widest font-medium opacity-70">Years Experience</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">Sri Lanka</h3>
              <p className="text-sm uppercase tracking-widest font-medium opacity-70">Base Operations</p>
            </div>
            <div>
              <h3 className="text-5xl font-bold mb-2">99%</h3>
              <p className="text-sm uppercase tracking-widest font-medium opacity-70">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">Ready to transform your business?</h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">
              Schedule a free consultation with our senior consultants today and discover how we can help you thrive.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link to="/contact" className="px-10 py-5 bg-white text-gray-900 rounded-full font-bold hover:scale-105 transition-transform">
                Book a Consultation
              </Link>
              <Link to="/hire" className="px-10 py-5 bg-brand-primary text-white rounded-full font-bold hover:scale-105 transition-transform">
                View Our Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
