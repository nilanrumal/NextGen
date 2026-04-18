import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 text-white mb-6">
              <img 
                src="input_file_0.png" 
                alt="NextGen Logo" 
                className="h-10 w-auto invert brightness-0 grayscale opacity-80"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold tracking-tight">NextGen Consultants & Doctors</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70">
              Your trusted partner for compliance, accounting, and strategic business growth. Professional excellence at every step.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/hire" className="hover:text-brand-secondary transition-colors">Accounting</Link></li>
              <li><Link to="/hire" className="hover:text-brand-secondary transition-colors">Tax Consulting</Link></li>
              <li><Link to="/hire" className="hover:text-brand-secondary transition-colors">Internal Auditing</Link></li>
              <li><Link to="/hire" className="hover:text-brand-secondary transition-colors">Company Secretarial</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>No. 185, Ebert Lane, Kaldemulla, Moratuwa. 10400</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>+94 77 338 6064</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-secondary shrink-0" />
                <span>ceo@consultantsdoctors.com</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-semibold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary transition-all">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
          <p>© 2026 NextGen Consultants & Doctors Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/admin" className="hover:underline">Admin Login</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
