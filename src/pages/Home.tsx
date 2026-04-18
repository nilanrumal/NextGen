import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ShieldCheck, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

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

export default function Home() {
  const [config, setConfig] = useState<any>({
    bannerTitle: "Empowering Businesses",
    bannerSubtitle: "Next Generation Consultancy",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 bg-gradient-to-br from-white via-green-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {config.bannerSubtitle}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-8">
                {config.bannerTitle.split(' ').map((word: string, i: number) => 
                  word.toLowerCase() === 'businesses' ? <span key={i} className="text-brand-primary">Businesses </span> : word + ' '
                )}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
                Trusted partner for Accounting, Tax, and Management Consultancy. We bridge the gap between compliance and growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/hire" className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all shadow-xl shadow-green-500/20">
                  Hire Our Experts
                </Link>
                <Link to="/about" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold hover:border-brand-primary transition-all flex items-center group">
                  Learn More <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-brand-primary/10 rounded-3xl blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop" 
                alt="Professional Workspace" 
                className="relative rounded-3xl shadow-2xl border border-white/50 object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-12 -left-8 bg-white p-6 rounded-2xl shadow-xl professional-shadow animate-bounce-slow">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">100% Compliant</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Global Standards</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
