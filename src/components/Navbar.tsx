import { Link } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="input_file_0.png" 
                alt="NextGen Logo" 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold tracking-tight text-gray-900">NextGen Consultants & Doctors</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors">About Us</Link>
            <Link to="/hire" className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors">Hire Us</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors">Contact</Link>
            <Link to="/hire" className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-secondary transition-all transform hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">About Us</Link>
          <Link to="/hire" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Hire Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Contact</Link>
          <Link to="/hire" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-center bg-brand-primary text-white rounded-lg font-semibold mt-4">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
