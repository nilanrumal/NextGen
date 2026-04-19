import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const leaders = [
  {
    name: "Dr. Kamal Peiris",
    role: "Founder & CEO",
    company: "NextGen Consultants & Doctors (Pvt) Ltd",
    bio: [
      "At NextGen Consultants & Doctors, we believe businesses succeed when strategy, operations, and people are aligned with insight and purpose.",
      "With over 18 years of experience, rigorous research, and practical solutions, we support enterprises — from micro-businesses and SMEs to large organizations — in achieving sustainable growth and lasting impact.",
      "Our approach is rooted in integrity, innovation, and empowerment, ensuring that every engagement translates into actionable strategies and enduring business legacies."
    ],
    credentials: [
      "DBA – Reading",
      "MBA – University of Colombo",
      "B.Sc. (Special) – USJP",
      "ACMA | AMSLIM | MCPM",
      "CMA Prize Winner",
      "Registered Company Secretary",
      "Family-Owned SME Researcher",
      "Visiting Lecturer"
    ],
    image: "https://firebasestorage.googleapis.com/v0/b/antigravity-ai.appspot.com/o/attachments%2F1745089775369_input_file_0.png?alt=media",
    tag: "Founder's Message"
  }
];

export default function LeadershipSection() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 inline-block">World-Class Expertise</span>
          <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight">Leadership & <span className="italic text-gray-400">Strategic Advisors</span></h2>
        </div>

        <div className="space-y-32">
          {leaders.map((leader, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative z-10 group overflow-hidden rounded-[4rem] aspect-[4/5] shadow-2xl">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
                     <p className="text-white font-serif italic text-xl">"Innovation is the cornerstone of market leadership."</p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-secondary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
                <div className="absolute top-1/2 -left-8 h-32 w-1 bg-brand-primary/30" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-8">
                  <span className="h-2 w-2 rounded-full bg-brand-primary mr-3 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{leader.tag}</span>
                </div>
                
                <h3 className="text-5xl font-serif mb-2">{leader.name}</h3>
                <p className="text-brand-primary font-bold text-lg mb-8 tracking-wide uppercase text-sm">{leader.role}</p>

                {leader.credentials && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {leader.credentials.map((cred, cIdx) => (
                      <span key={cIdx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                        {cred}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="space-y-6 relative mb-12">
                  <Quote className="absolute -left-12 -top-4 h-8 w-8 text-gray-100 -z-10" />
                  {leader.bio.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-600 leading-relaxed font-light text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center space-x-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=Expert${i}`} 
                          alt="Validation"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Supported by the full <span className="text-gray-900 font-bold">NEXTGEN</span> network of consultants</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
