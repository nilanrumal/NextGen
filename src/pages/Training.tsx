import { motion } from 'motion/react';
import { Mail, Phone, ArrowRight, CheckCircle2, GraduationCap, Users, ShieldCheck, TrendingUp, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const offerings = [
  {
    title: "Strategic & Leadership",
    items: ["Executive Leadership & Decision-Making", "Strategic Thinking & Business Planning", "Corporate Governance Training", "Succession Planning for SMEs"],
    icon: Target,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Finance & Accounting",
    items: ["Financial Management & Analysis", "Budgeting and Cost Control", "Taxation Awareness & Compliance", "Internal Auditing & Risk Management"],
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "Operations & Process",
    items: ["Business Process Optimization", "Standard Operating Procedures (SOP) Design", "Workflow Systemization", "Controls & Compliance Implementation"],
    icon: Zap,
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "Marketing & Development",
    items: ["Strategic Marketing & Branding", "Sales Effectiveness", "Market Research & Analysis", "SME Growth Strategies"],
    icon: Users,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "People & Talent",
    items: ["Performance Management Systems", "HR Policies & Compliance", "Leadership & Team Development", "Change Management"],
    icon: GraduationCap,
    color: "bg-rose-50 text-rose-600"
  },
  {
    title: "Specialized SME Training",
    items: ["Family Business Governance", "SME Financing & Proposals", "Digital Transformation", "Sustainability & Growth"],
    icon: ShieldCheck,
    color: "bg-indigo-50 text-indigo-600"
  }
];

export default function Training() {
  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Professional Development</span>
            <h1 className="text-4xl md:text-7xl font-serif mb-8 leading-tight">Empowering Professionals. <span className="italic text-gray-400">Elevating Performance</span>.</h1>
            <p className="text-gray-500 text-xl leading-relaxed mb-10">
              Our corporate training programs are designed to equip professionals, executives, and entrepreneurs with practical insights, strategic thinking, and operational expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
               <a href="mailto:ceo@consultantsdoctors.com" className="px-10 py-5 bg-gray-900 text-white rounded-full font-bold hover:bg-brand-primary transition-all flex items-center justify-center space-x-3">
                  <span>Contact Us Today</span>
                  <ArrowRight className="h-5 w-5" />
               </a>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
                  alt="Corporate Training" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xl leading-relaxed">
            Led by <span className="text-gray-900 font-bold">Dr. Kamal Peiris</span>, an expert in Finance, Marketing, Administration, and Strategy, our training programs are research-backed, result-oriented, and tailored to organizational needs.
          </p>
        </div>
      </section>

      {/* Offerings Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">Our Corporate <span className="italic text-gray-400">Offerings</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((offering, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 ${offering.color}`}>
                  <offering.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-6">{offering.title}</h3>
                <ul className="space-y-4">
                  {offering.items.map((item, j) => (
                    <li key={j} className="flex items-start space-x-3 text-sm text-gray-500">
                      <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us for Training */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-4xl font-serif mb-12">Why Choose NextGen for <span className="italic text-gray-400 text-3xl">Corporate Training</span>?</h2>
                  <div className="space-y-8">
                    {[
                      { title: "Expert-Led Programs", desc: "Designed and delivered by a seasoned CEO and researcher." },
                      { title: "Tailored Content", desc: "Modules are customized to meet specific organizational challenges." },
                      { title: "Interactive & Practical", desc: "Focus on real-world applications and hands-on exercises." },
                    ].map((benefit, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-6 w-6 rounded-full bg-brand-primary/20 flex items-center justify-center mt-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                        </div>
                        <div>
                          <h5 className="text-white font-bold">{benefit.title}</h5>
                          <p className="text-gray-400 text-sm mt-1">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem]">
                   <h3 className="text-2xl font-serif mb-8 italic">Get Started</h3>
                   <p className="text-gray-400 mb-10">Empower your teams and drive measurable results with NextGen Corporate Training.</p>
                   <div className="space-y-6">
                      <a href="mailto:ceo@consultantsdoctors.com" className="flex items-center space-x-4 group">
                         <div className="h-12 w-12 rounded-full bg-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail className="h-5 w-5 text-white" />
                         </div>
                         <span className="font-bold underline underline-offset-4">ceo@consultantsdoctors.com</span>
                      </a>
                      <a href="tel:0773386064" className="flex items-center space-x-4 group">
                         <div className="h-12 w-12 rounded-full bg-brand-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Phone className="h-5 w-5 text-white" />
                         </div>
                         <span className="font-bold underline underline-offset-4">+94 77 338 6064</span>
                      </a>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
