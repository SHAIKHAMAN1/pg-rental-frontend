import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-16 pb-10 px-6 md:px-16 lg:px-24 xl:px-32 ">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-semibold text-primary">
            PG Rental
          </h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Find verified PG accommodations for students and professionals across major cities. Safe, affordable, and hassle-free.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/PGs" className="hover:text-primary">Browse PGs</Link></li>
            <li><Link to="/owner" className="hover:text-primary">List Your PG</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary">Help Center</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-primary">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Email: support@pgrental.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Pune, Maharashtra</li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">

        <p>
          © {new Date().getFullYear()} PG Rental. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary">Instagram</a>
          <a href="#" className="hover:text-primary">LinkedIn</a>
          <a href="#" className="hover:text-primary">Twitter</a>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
