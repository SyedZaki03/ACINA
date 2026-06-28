// Import React core library
import React from "react";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import required icons from lucide-react library
import { Brain, ShieldCheck, FileText, Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";
// Import Link component to navigate client-side routes without reloading
import { Link } from "react-router-dom";

// Export default CLIAFooter functional component
export default function CLIAFooter() {
  return (
    // Outer footer layout container (dark navy background, slate borders, custom selection styling)
    <footer className="w-full bg-[#020617] text-gray-400 border-t border-slate-900 selection:bg-cyan-500/30">
      {/* Max width container matching page layouts */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        {/* Grid layout containing brand logo on left, newsletter panel on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Identity details column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Link wrapper directing to home path */}
            <Link to="/" className="inline-block">
              {/* Highlight gradient styled text Logo */}
              <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ACINA
              </h3>
            </Link>
            {/* Description copy text */}
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              The next generation of legal intelligence. We empower firms to draft with precision, analyze with speed, and negotiate with absolute confidence.
            </p>
            {/* Social media media links wrapper */}
            <div className="flex gap-5 text-gray-600">
              <Twitter size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
              <Linkedin size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
              <Github size={20} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Newsletter Signup panel */}
          <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800/50 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             {/* Radial backdrop blur circle layer */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
             {/* Text descriptions container */}
             <div className="relative z-10">
                <h4 className="text-white font-bold text-xl mb-2">Weekly Legal-Tech Insights</h4>
                <p className="text-sm text-gray-500">Join 5,000+ lawyers staying ahead of AI.</p>
             </div>
             {/* Email registration form input */}
             <form className="w-full md:w-auto flex relative z-10">
                <input 
                  type="email" 
                  placeholder="lawyer@firm.com" 
                  className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-l-xl text-sm focus:ring-1 focus:ring-cyan-500 outline-none w-full md:w-64 transition-all"
                />
                {/* Submit button carrying hover translation animation logic */}
                <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-3 rounded-r-xl transition-all group">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
          </div>
        </div>

        {/* --- MIDDLE SECTION: QUICK LINKS --- */}
        {/* Responsive grid mapping lists of links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12 border-t border-slate-900 pt-16">
          
          {/* Product Category Column */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/features" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"/>Platform Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"/>Pricing Plans</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"/>Security Architecture</Link></li>
              <li><Link to="/templates" className="hover:text-white transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"/>Template Library</Link></li>
            </ul>
          </div>

          {/* Company Category Column */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
              {/* Added a special hiring badge string */}
              <li><Link to="/careers" className="hover:text-white transition-colors flex items-center gap-2">Careers <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full">Hiring</span></Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/legal" className="hover:text-white transition-colors">Legal Documents</Link></li>
            </ul>
          </div>

          {/* Legal Compliance Column */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>

          {/* Ecosystem Tech Stack Icons Grid */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em]">Ecosystem</h4>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="p-3 bg-slate-900/50 rounded-xl hover:text-cyan-400 transition-all"><Brain size={24} /></div>
              <div className="p-3 bg-slate-900/50 rounded-xl hover:text-cyan-400 transition-all"><FileText size={24} /></div>
              <div className="p-3 bg-slate-900/50 rounded-xl hover:text-cyan-400 transition-all"><ShieldCheck size={24} /></div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION --- */}
        {/* Footnote details and system uptime status */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright description string */}
          <p className="text-xs text-gray-600 font-medium tracking-wide">
            © 2026 ACINA LEGAL INTELLIGENCE SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          {/* Operational status details */}
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-700">
             <span>Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}