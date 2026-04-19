import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ShieldCheck, TrendingUp, Users, ChevronRight, Target, Award, Heart, Leaf, CheckCircle2, Zap } from 'lucide-react';
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
    title: "Empowering Enterprises. Enabling Legacies.",
    subtitle: "Strategic Consultancy",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    ctaText: "Explore Services",
    ctaLink: "/hire"
  },
  {
    title: "Turning Insight into Impact, Strategy into Results.",
    subtitle: "Accuracy & Compliance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
    ctaText: "Consult Now",
    ctaLink: "/contact"
  },
  {
    title: "Global Standards, Professional Excellence",
    subtitle: "NextGen Consultants",
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

      {/* Introduction Section */}
      <section className="py-24 bg-white border-y border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Empowering <span className="text-brand-secondary">Enterprises</span>. Enabling Legacies.</h2>
            <p className="text-gray-600 text-xl leading-relaxed mb-6 font-medium">Turning Insight into Impact, Strategy into Results.</p>
            <p className="text-gray-500 text-lg leading-relaxed">
              We help businesses and organizations enhance performance, solve complex challenges, and achieve sustainable growth. Serving micro businesses, SMEs, and large enterprises, we provide strategic guidance, operational support, and compliance solutions to deliver measurable results, both in Sri Lanka and globally.
            </p>
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

      {/* Vision & Mission Section */}
      <section className="py-32 relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Vision Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10"
            >
              <div className="h-16 w-16 bg-brand-primary rounded-2xl flex items-center justify-center mb-8">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-serif mb-6 italic">Our Vision</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                To be a globally trusted partner in business transformation, empowering enterprises to achieve sustainable growth and create enduring legacies worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10"
            >
              <div className="h-16 w-16 bg-brand-secondary rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-serif mb-6 italic">Our Mission</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                To deliver innovative, research-driven consulting solutions that optimize strategy, operations, financial management, and governance, enabling businesses of all sizes to thrive and achieve measurable success globally.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Integrity and Excellence</span>
            <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight">Our Core <span className="italic text-gray-400">Values</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: "Integrity & Ethics", desc: "We act with honesty, transparency, and professionalism in everything we do.", icon: ShieldCheck },
              { title: "Excellence & Quality", desc: "We deliver impactful solutions that create lasting value for our clients.", icon: Award },
              { title: "Innovation & Insight", desc: "We combine research and creativity to solve even the most complex business challenges.", icon: Zap },
              { title: "Client-Centricity", desc: "Your success is our priority; we tailor every solution to your unique needs.", icon: Heart },
              { title: "Sustainability & Legacy", desc: "We focus on strategies that enable long-term growth and enduring legacies.", icon: Leaf },
              { title: "Collaboration & Empowerment", desc: "We partner with clients, sharing knowledge to strengthen capabilities.", icon: Users },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">The NextGen Advantage</span>
              <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">Why <span className="italic text-gray-400">Choose Us</span>?</h2>
              <div className="space-y-6">
                {[
                  { title: "Proven Expertise", desc: "Over 18 years of experience in Finance, Marketing, Administration, and Strategy." },
                  { title: "Research-Driven Solutions", desc: "Evidence-based strategies backed by rigorous academic research." },
                  { title: "Tailored Approach", desc: "Customized solutions for micro-enterprises, SMEs, and large organizations." },
                  { title: "Integrity & Accountability", desc: "Transparent, ethical, and reliable specialized services." },
                  { title: "Global & All-Island Reach", desc: "Supporting businesses across Sri Lanka and internationally." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600880212319-462799b66821?q=80&w=2070&auto=format&fit=crop" 
                  alt="Why Choose Us" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Milestone Announcement */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100 flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px]">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745089775369_input_file_0.png?alt=media" 
                alt="Dr. Kamal Peiris" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            
            <div className="w-full lg:w-1/2 p-12 lg:p-20">
              <span className="flex items-center space-x-3 mb-6">
                <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">Strategic Milestone</span>
              </span>
              
              <h2 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight text-gray-900">
                Strengthening Our <span className="italic text-gray-400">Advisory Capabilities</span>.
              </h2>
              
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                We are proud to welcome <span className="text-gray-900 font-bold">Dr. Kamal Peiris</span>, Founder & CEO of NEXTGEN Consultants & Doctors (Pvt) Ltd, as our resident business and strategic consultant. His appointment marks a key milestone in delivering long-term value to our stakeholders.
              </p>
              
              <Link 
                to="/about" 
                className="inline-flex items-center space-x-4 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-brand-primary transition-colors group"
              >
                <span>Read Full Announcement</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
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
