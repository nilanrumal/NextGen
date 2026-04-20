import { motion } from 'motion/react';
import { Shield, Target, Award, CheckCircle2, Mail, Loader2 } from 'lucide-react';
import LeadershipSection from '../components/About/LeadershipSection';
import StrategyFramework from '../components/About/StrategyFramework';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function About() {
  const [config, setConfig] = useState<any>({
    about: {
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
    }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        setConfig((prev: any) => ({ ...prev, ...snapshot.data() }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-20">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src={config.about?.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"} 
                alt="Our Leadership" 
                className="rounded-[3rem] shadow-2xl relative z-10 aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-brand-primary/10 rounded-full blur-3xl" />
            </motion.div>

            <div>
              <span className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Our Story</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Trusted Partner for <span className="text-brand-secondary">Compliance & Growth</span>.</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                NextGen Consultants & Doctors Pvt Ltd was founded with a singular vision: to revolutionize the traditional consultancy experience. We don't just crunch numbers; we provide the strategic insights that empower businesses to thrive in a complex regulatory environment.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Expert Financial Guidance</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Our senior consultants bring decades of experience in diverse industries.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Ethics-First Approach</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Integrated audit and compliance procedures that protect your reputation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadershipSection />

      {/* Our Team Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Multidisciplinary Excellence</span>
              <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">Our <span className="italic text-gray-400">Team</span></h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our strength lies in our highly qualified, multidisciplinary team, combining academic excellence with extensive industry experience.
              </p>
              <p className="text-gray-500 leading-relaxed mb-10">
                Each member brings professional credentials, hands-on expertise, and practical insights, enabling us to deliver innovative, evidence-based solutions across corporate planning, finance, taxation, operations, governance, and SME development. With a team that is academically accomplished, professionally certified, and experienced in real-world business environments, we ensure clients benefit from strategic guidance, operational excellence, and sustainable growth.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              {[
                { title: "Academic Excellence", desc: "Highly qualified members with strong academic backgrounds." },
                { title: "Industry Experience", desc: "Decades of hands-on expertise across multiple sectors." },
                { title: "Global Perspective", desc: "Strategic guidance aligned with international standards." },
                { title: "Practical Insights", desc: "Translating complex strategies into actionable results." },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StrategyFramework />

      {/* Careers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop" 
                alt="Careers Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Join our team</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Empower Enterprises, <span className="italic text-gray-400">Enable Legacies</span>.</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                  At NextGen Consultants & Doctors, our people are our greatest asset. We seek talented, motivated professionals who share our passion for empowering enterprises and enabling legacies.
                </p>
                
                <h4 className="text-white font-bold mb-6">Opportunities We Offer:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400 text-sm mb-12">
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Corporate Planning & Strategy</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Finance & Tax Consultancy</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Operations Optimization</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Internal Auditing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Research & SME Development</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                    <span>Secretarial & Legal Services</span>
                  </li>
                </ul>

                <a 
                  href="mailto:careers@consultantsdoctors.com" 
                  className="inline-flex items-center space-x-4 px-10 py-5 bg-white text-gray-900 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all transform hover:scale-105"
                >
                  <span>Apply Now</span>
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
                <h3 className="text-2xl font-serif text-white mb-8">Why Work With Us?</h3>
                <div className="space-y-8">
                  {[
                    { title: "Expertise & Learning", desc: "Collaborate with academically and professionally qualified experts." },
                    { title: "Dynamic Environment", desc: "A fast-growing firm that values creativity and collaboration." },
                    { title: "Career Growth", desc: "Opportunities for professional development and mentorship." },
                    { title: "Impactful Work", desc: "Contribute to projects that transform businesses." },
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-6 w-6 rounded-full bg-brand-primary/20 flex items-center justify-center mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                      </div>
                      <div>
                        <h5 className="text-white font-bold text-sm tracking-wide">{benefit.title}</h5>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
