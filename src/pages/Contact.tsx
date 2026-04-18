import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! Our team will contact you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect With Us</h1>
          <p className="text-gray-600 text-lg">We're here to answer your questions and help you navigate your business journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-bold mb-8">Quick Contact</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Our Office</h4>
                    <p className="text-gray-600">No. 185, Ebert Lane, Kaldemulla, Moratuwa. 10400</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Hotline</h4>
                    <p className="text-gray-600">+94 77 338 6064</p>
                    <p className="text-xs text-brand-primary mt-1 font-medium">Available Mon-Sat: 9AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-gray-600">ceo@consultantsdoctors.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white">
              <h3 className="text-xl font-bold mb-4">Want to Join Us?</h3>
              <p className="text-sm opacity-70 mb-6 leading-relaxed">We're always looking for talented accountants and auditors. Send your CV to careers@consultantsdoctors.com</p>
              <button className="px-8 py-3 bg-brand-primary rounded-full text-sm font-bold hover:bg-brand-secondary transition-all">Submit CV</button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl professional-shadow"
          >
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Inquiry Type</label>
                <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all">
                  <option>Accounting Services</option>
                  <option>Tax Consulting</option>
                  <option>Internal Auditing</option>
                  <option>Company Secretarial</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                <textarea required rows={4} placeholder="How can we help you?" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"></textarea>
              </div>
              <button 
                disabled={loading}
                className="w-full py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
