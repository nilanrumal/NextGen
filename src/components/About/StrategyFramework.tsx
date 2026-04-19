import { motion } from 'motion/react';
import { Lightbulb, Target, BookOpen, Flag, Zap, ClipboardList, Layers, Users, TrendingUp, ShieldCheck, Cpu, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { title: "Vision", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
  { title: "Mission", icon: Target, color: "text-red-500", bg: "bg-red-50" },
  { title: "Corporate Plan", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Goals", icon: Flag, color: "text-emerald-500", bg: "bg-emerald-50" },
  { title: "Strategies", icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
  { title: "Action Plans", icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-50" },
  { title: "Structures", icon: Layers, color: "text-cyan-500", bg: "bg-cyan-50" },
  { title: "People", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  { title: "JDs & KPIs", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-50" },
  { title: "SOPs", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
  { title: "Systems", icon: Cpu, color: "text-slate-500", bg: "bg-slate-50" },
  { title: "Controls", icon: Settings, color: "text-brand-primary", bg: "bg-green-50" },
];

export default function StrategyFramework() {
  return (
    <section className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="lg:w-1/2">
            <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">Our Methodology</span>
            <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">
              Building a <span className="italic text-gray-400">Future-Ready</span> Organization.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
              Success is not an accident; it is the result of a disciplined framework. Our signature 12-Step Growth Formula, developed by Dr. Kamal Peiris, provides the blueprint for sustainable scaling and operational excellence.
            </p>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center"
              >
                <div className={`h-12 w-12 ${step.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Step {index + 1}</span>
                <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden text-center lg:text-left">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none" />
           
           <div className="flex flex-col lg:flex-row justify-between items-center relative z-10 gap-12">
             <div className="max-w-2xl">
               <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">Ready to implement this framework?</h3>
               <p className="text-gray-400 text-lg">Connect with our team to start your organization's transformation journey today.</p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-6">
                <a 
                  href="tel:0773386064" 
                  className="flex items-center space-x-4 px-10 py-5 bg-white text-gray-900 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  <span className="text-2xl font-serif">077 338 6064</span>
                </a>
                <Link 
                  to="/contact" 
                  className="px-10 py-5 bg-brand-primary text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center space-x-3"
                >
                  <span>Let's Connect</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
