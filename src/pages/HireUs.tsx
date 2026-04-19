import { motion } from 'motion/react';
import { Check, ArrowRight, Target, Briefcase, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const serviceCategories = [
  {
    name: "Strategic & Corporate Services",
    icon: Target,
    items: [
      "Corporate Plan Development & Review",
      "Preparation of Standard Operating Procedures (SOPs)",
      "Preparation of Proposals for Bank Loans"
    ],
    popular: true
  },
  {
    name: "Financial & Accounting Services",
    icon: Briefcase,
    items: [
      "Accounting & Outsourcing",
      "Tax Consultancy",
      "Internal Auditing",
      "Payroll Management"
    ],
    popular: false
  },
  {
    name: "Corporate Compliance & Legal",
    icon: Shield,
    items: [
      "Company Secretarial Services",
      "Trademark Registration",
      "EPF/ETF & Customs Registrations"
    ],
    popular: false
  }
];

export default function HireUs() {
  return (
    <div className="pt-20 pb-24 bg-gradient-to-b from-green-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Our Expertise</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Expert Solutions</h1>
          <p className="text-gray-600 text-lg">We provide an impartial, third-party perspective, helping organizations streamline processes, optimize resources, and achieve sustainable growth.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {serviceCategories.map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] border ${pkg.popular ? 'bg-brand-primary text-white border-brand-primary shadow-2xl scale-105' : 'bg-white border-gray-100 shadow-xl'} flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-secondary text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Strategic Pillar
                </div>
              )}
              
              <div className={`h-16 w-16 mb-8 rounded-2xl flex items-center justify-center ${pkg.popular ? 'bg-white/10' : 'bg-gray-50 text-brand-primary'}`}>
                <pkg.icon className="h-8 w-8" />
              </div>

              <h3 className="text-2xl font-bold mb-6 leading-tight">{pkg.name}</h3>

              <div className="flex-grow">
                <ul className="space-y-5 mb-10">
                  {pkg.items.map((f, j) => (
                    <li key={j} className="flex items-start space-x-3 text-sm font-medium">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${pkg.popular ? 'bg-white/20' : 'bg-blue-50'}`}>
                        <Check className={`h-3 w-3 ${pkg.popular ? 'text-white' : 'text-brand-primary'}`} />
                      </div>
                      <span className={pkg.popular ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                to="/contact" 
                className={`w-full py-5 rounded-full font-bold text-center transition-all flex items-center justify-center group ${pkg.popular ? 'bg-white text-brand-primary hover:bg-gray-100' : 'bg-brand-primary text-white hover:bg-brand-secondary'}`}
              >
                Inquire Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-center border border-gray-100 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-bold mb-4">Empowering Your Organization</h2>
          <p className="text-gray-400 mb-8 max-w-3xl mx-auto">From micro-businesses to large scale organizations, we tailor our solutions to your unique needs, ensuring every effort drives measurable success globally.</p>
          <Link to="/contact" className="px-12 py-5 bg-brand-primary text-white rounded-full font-bold hover:scale-105 transition-transform inline-block">
            Start Your Transformation
          </Link>
        </div>
      </div>
    </div>
  );
}
