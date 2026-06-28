// Import React and hooks for managing state variables
import React, { useState } from "react";
// Import useNavigate and Link to route internal paths
import { useNavigate, Link } from "react-router-dom";
// Import framer-motion library to handle entry transitions
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react library
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Zap } from "lucide-react";
// Import absolute background image asset
import bgImage from "../assets/signup-bg.jpg";

// Export default Signup functional page component
export default function Signup() {
  // Navigation hook
  const navigate = useNavigate();
  // State carrying forms details variables
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  
  // State tracking API request statuses (idle, loading, success, error)
  const [status, setStatus] = useState("idle");
  // State tracking custom validation or backend error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Input change handler to sync forms state changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handler for form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear old errors
    setErrorMessage("");
    
    // Validate that password and confirmation string match exactly
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    // Enforce term agreement checkbox selection validation
    if (!form.terms) {
      setErrorMessage("Please accept the Terms & Conditions");
      return;
    }

    // Update status state to loading
    setStatus("loading");

    try {
      // Resolve backend API address, falling back to local port 8000
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Perform POST registration request to the backend server
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirm_password: form.confirmPassword,
        }),
      });

      // Parse JSON response body
      const data = await res.json();

      // Check if server validation or email conflict occurred
      if (!res.ok) {
        setErrorMessage(data.message || data.detail || "Signup failed");
        setStatus("error");
        return;
      }

      // Mark success status
      setStatus("success");
      // Navigate to login view after a short delay (2 seconds)
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Log connection failures
      setErrorMessage("Unable to connect to server. Check your backend.");
      setStatus("error");
    }
  };

  return (
    // Outer flex centering container (dark background, font classes, and relative layers)
    <div className="min-h-screen flex items-center justify-center lg:justify-end bg-[#020617] relative overflow-hidden font-sans">
      {/* Background graphic layout element with opacity masks */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Gradient shade overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-[#020617]/80 to-transparent" />

      {/* Signup Card block container carrying slide-in animation entry metrics */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-20 w-full max-w-lg lg:mr-24 p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] backdrop-blur-md"
      >
        {/* Inner Card block (navy background, rounded borders, shadow effects) */}
        <div className="bg-[#0B1220]/90 p-10 md:p-12 rounded-[2.4rem] shadow-2xl">
          
          {/* Brand Logo and Subtitle Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
               {/* Glowing logo container */}
               <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap size={22} fill="currentColor" />
               </div>
               <h1 className="text-3xl font-black tracking-tight text-white">Join ACINA</h1>
            </div>
            <p className="text-gray-400">Start your journey into AI-driven legal intelligence.</p>
          </div>

          {/* Registration form block */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Harvey Specter"
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="harvey@pearsonhardman.com"
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password and Confirmation Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Confirmation field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Confirm</label>
                <input
                  required
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Terms Checkbox Agreement Switch */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="terms"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-700 bg-slate-900 checked:bg-cyan-500 transition-all"
                  onChange={handleChange}
                />
                <CheckCircle2 className="absolute ml-0.5 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" size={16} />
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300">
                I agree to the <Link to="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>
              </span>
            </label>

            {/* Feedback Messages (Errors or success) */}
            <AnimatePresence>
              {/* Error feedback badge banner */}
              {errorMessage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  <AlertCircle size={14} /> {errorMessage}
                </motion.div>
              )}
              {/* Success feedback badge banner */}
              {status === "success" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 text-green-400 text-xs bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                  <CheckCircle2 size={14} /> Account verified! Redirecting to login...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button displaying dynamic labels */}
            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full group bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? "Creating Account..." : <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>

            {/* Login redirect link */}
            <p className="text-center text-gray-500 text-sm mt-6">
              Already using ACINA?{" "}
              <Link to="/login" className="text-white font-bold hover:text-cyan-400 transition-colors">Sign In</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}