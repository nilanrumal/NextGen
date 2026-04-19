import { motion } from 'motion/react';
import { BookOpen, TrendingUp, Cpu, FileText, Users, MapPin, Share2, Activity, CheckCircle2 } from 'lucide-react';

const insights = [
  {
    title: "Access to Finance",
    desc: "Limited access to financial resources is a primary constraint. Studies indicate that financial inadequacy and lack of banking facilities hinder business growth."
  },
  {
    title: "Technological Adaptation",
    desc: "SMEs that fail to integrate modern technologies struggle to remain competitive and efficient, affecting long-term survival."
  },
  {
    title: "Government Regulations",
    desc: "Simplifying regulatory processes and enhancing financial literacy could foster a more conducive environment for SME development."
  },
  {
    title: "Entrepreneurial Orientation",
    desc: "Proactive decision-making and adaptability make SMEs more resilient, especially during economic crises."
  },
  {
    title: "Skilled Labor Availability",
    desc: "Enterprises with access to a competent workforce perform better, as skilled employees contribute to productivity and innovation."
  },
  {
    title: "Infrastructure & Local Support",
    desc: "Better infrastructure and community support networks significantly impact SME performance."
  },
  {
    title: "Founder Experience",
    desc: "The transfer of skills to the next generation enhances business continuity and success over time."
  },
  {
    title: "Impact of Economic Crises",
    desc: "Crises underscore vulnerability, but those with dynamic capabilities have demonstrated resilience and sustained operations."
  }
];

export default function Research() {
  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=2070&auto=format&fit=crop" 
            alt="Research Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Evidence-Based Consulting</span>
            <h1 className="text-4xl md:text-7xl font-serif mb-8">Research <span className="italic text-gray-400">Insights</span> on SME Success.</h1>
            <p className="text-gray-400 text-xl leading-relaxed">
              Small and Medium Enterprises (SMEs) are pivotal to Sri Lanka's economy. Our research identifies the critical factors that influence their long-term viability and success.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="text-brand-primary font-serif italic text-4xl mb-6 opacity-30">0{i + 1}</div>
                <h3 className="text-xl font-bold mb-4">{insight.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{insight.desc}</p>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                   Source: Academic Research
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-primary rounded-[3rem] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-serif mb-8">Nurturing Resilience</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Addressing these factors through targeted policies and support systems can enhance the resilience and growth prospects of SMEs, ensuring their continued contribution to the nation's economy.
              </p>
              <div className="flex items-center space-x-3 text-sm font-bold">
                 <CheckCircle2 className="h-6 w-6" />
                 <span>ResearchGate & Wayamba Journal Verification</span>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2rem]">
                  <h4 className="text-xl font-bold mb-6 italic">Key Takeaway</h4>
                  <p className="text-white/80 leading-relaxed italic">
                    "The survival and success of SMEs in Sri Lanka are influenced by a combination of financial access, technological adaptation, regulatory environment, and entrepreneurial mindset."
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
