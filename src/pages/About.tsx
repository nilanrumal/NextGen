import { motion } from 'motion/react';
import { Shield, Target, Award, CheckCircle2 } from 'lucide-react';

export default function About() {
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" 
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

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">The NextGen Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Precision", desc: "Every decimal matters. We maintain the highest standards of accuracy in auditing.", icon: Target },
              { title: "Trust", desc: "Long-term relationships built on transparency and non-compromised integrity.", icon: Shield },
              { title: "Excellence", desc: "Consistently delivering results that exceed regulatory requirements.", icon: Award },
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-lg shadow-gray-200/50">
                <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <item.icon className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
