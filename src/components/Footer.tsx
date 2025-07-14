
import React from 'react';
import AventraLogo from './AventraLogo';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <AventraLogo size={150} />
            <p className="text-gray-400 mt-4 max-w-md">
              Creating unforgettable travel experiences since 2018. Your journey to extraordinary destinations starts with us.
            </p>
            <div className="flex space-x-4 mt-6">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-palette-teal cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-palette-teal cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-palette-teal cursor-pointer transition-colors" />
              <Youtube className="w-6 h-6 text-gray-400 hover:text-palette-teal cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-palette-orange">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-white transition-colors">Packages</Link></li>
              <li><Link to="/assistance" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-palette-orange">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-400">+91 8296755162</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-400">lifetrenchess@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-palette-teal" />
                <span className="text-gray-400">Aventra Travels, Siruseri, Chennai(560068) </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Aventra. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
