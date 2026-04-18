import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const packages = [
  {
    name: "Standard Accounting",
    price: "Custom",
    features: [
      "Monthly Bookkeeping",
      "Financial Statements",
      "Basic Tax Filing",
      "Compliance Review"
    ],
    popular: false
  },
  {
    name: "Growth Partner",
    price: "Custom",
    features: [
      "Internal Auditing",
      "Advanced Tax Strategy",
      "Management Reporting",
      "Strategic Consultation",
      "Payroll Management"
    ],
    popular: true
  },
  {
    name: "Corporate Success",
    price: "Custom",
    features: [
      "Company Secretarial",
      "Project Proposals",
      "Risk Assessment",
      "Statutory Audits",
      "Investor Relations"
    ],
    popular: false
  }
];

export default function HireUs() {
  return (
    <div className="pt-20 pb-24 bg-gradient-to-b from-green-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Our Solutions</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Choose Your Growth Path</h1>
          <p className="text-gray-600 text-lg">Tailored consultancy packages designed to meet the unique needs of your business at every stage of its journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[3rem] border ${pkg.popular ? 'bg-brand-primary text-white border-brand-primary shadow-2xl scale-105' : 'bg-white border-gray-100 shadow-xl'} flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-secondary text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Preferred
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-8">
                <span className="text-4xl font-bold">{pkg.price}</span>
              </div>

              <div className="flex-grow">
                <ul className="space-y-5 mb-10">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center space-x-3 text-sm font-medium">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${pkg.popular ? 'bg-white/20' : 'bg-blue-50'}`}>
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
                Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gray-50 rounded-[3rem] text-center border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Dedicated Project Proposals</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Need a complex project proposal for bank loans, investor pitching, or statutory compliance? Our specialized team delivers high-impact documentation.</p>
          <Link to="/contact" className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all">
            Inquire About Proposals
          </Link>
        </div>
      </div>
    </div>
  );
}
