// Import React and standard state and effect hooks
import React, { useState, useEffect } from "react";
// Import Link to navigate internal pages and useLocation to retrieve active paths
import { Link, useLocation } from "react-router-dom";
// Import framer-motion library to handle element transitions and overlays
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react
import { Menu, X, ArrowRight, Zap } from "lucide-react";

// Export default Navbar functional component
export default function Navbar() {
  // State variables to track mobile dropdown status
  const [open, setOpen] = useState(false);
  // State variables to track scroll status to enable dynamic glassmorphism styling
  const [scrolled, setScrolled] = useState(false);
  // Location hook to track currently matching route pathname
  const location = useLocation();

  // Side-effect listener to add window scroll events and toggle scrolled class variables
  useEffect(() => {
    // Check if vertical window scroll exceeds 20px
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Clean up event listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation paths definition list
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" }, 
    { name: "Contact", path: "/contact" },
  ];

  return (
    // Outer animated header container carrying header entry transition rules
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      // Conditionally style header backdrop filters and padding based on scroll status
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
        ? "py-3 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
        : "py-5 bg-transparent"
      }`}
    >
      {/* Centered navigation alignment bar */}
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo Wrapper linking to root path */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* Animated gradient icon block container */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform">
            <Zap size={18} className="text-slate-900" fill="currentColor" />
          </div>
          {/* Logo brand copy text in silver gradient font */}
          <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tighter">
            ACINA
          </span>
        </Link>

        {/* Desktop Navigation Link Menu */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
          {/* List navigation mappings */}
          <ul className="flex items-center gap-8 text-sm font-semibold">
            {navItems.map((item) => {
              // Determine active item matching status
              const active = location.pathname === item.path;
              return (
                <li key={item.name} className="relative group">
                  {/* Redirect link for item */}
                  <Link
                    to={item.path}
                    className={`transition-colors duration-300 ${
                      active ? "text-cyan-400" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {/* Highlight neon underline bar for active router path */}
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-[22px] left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Login & Signup Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Sign In redirection link */}
          <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
            Sign In
          </Link>
          {/* Signup action button with sliding hover arrow animation wrapper */}
          <Link
            to="/signup"
            className="group relative px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-sm overflow-hidden transition-all hover:pr-9"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" 
            />
          </Link>
        </div>

        {/* Mobile Navigation toggle trigger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          {/* Toggle between Menu and Close icons */}
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            // Dropdown sliding animation parameters
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            {/* Mobile list links wrapper */}
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  // Close dropdown on click
                  onClick={() => setOpen(false)}
                  className={`text-lg font-bold ${
                    location.pathname === item.path ? "text-cyan-400" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              {/* Mobile CTA links */}
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setOpen(false)} className="text-center py-3 text-gray-400 font-bold">Sign In</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="py-4 bg-cyan-500 rounded-2xl text-slate-950 font-black text-center shadow-xl shadow-cyan-500/20">
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}