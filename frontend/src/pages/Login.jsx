// Import React and hooks for managing state variables
import React, { useState } from "react";
// Import useNavigate navigation hooks and Link redirection tags
import { useNavigate, Link } from "react-router-dom";
// Import framer-motion library to handle entry transitions
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react library
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, Zap } from "lucide-react";
// Import absolute background image asset
import bgImage from "../assets/signup-bg.jpg";

// Export default Login page functional component
export default function Login() {
  // Navigation hook
  const navigate = useNavigate();
  // State carrying forms email and password parameters
  const [form, setForm] = useState({ email: "", password: "" });
  // State tracking API request statuses (idle, loading, success, error)
  const [status, setStatus] = useState("idle");
  // State tracking custom validation or backend error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Input change handler to sync forms state changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handler for form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear old errors
    setErrorMessage("");
    // Set status to loading
    setStatus("loading");

    try {
      // Resolve backend API address, falling back to local port 8000
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Perform POST authentication request to the backend server
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Parse JSON response body
      const data = await res.json();

      // Check if server validation or authorization checks failed
      if (!res.ok) {
        setErrorMessage(data.message || data.detail || "Invalid credentials");
        setStatus("error");
        return;
      }

      // Store JWT token string in browser local storage
      localStorage.setItem("access_token", data.access_token);
      // Mark login success status
      setStatus("success");
      
      // Navigate to secure dashboard after a short delay (1.5 seconds)
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      // Log connection failures
      setErrorMessage("Server connection failed. Please try again.");
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

      {/* Login Card block container carrying slide-in animation entry metrics */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-20 w-full max-w-md lg:mr-24 p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] backdrop-blur-md mx-6"
      >
        {/* Inner Card block (navy background, rounded borders, shadow effects) */}
        <div className="bg-[#0B1220]/95 p-10 md:p-12 rounded-[2.4rem] shadow-2xl">
          
          {/* Brand Logo and Subtitle Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
               {/* Glowing logo container */}
               <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Zap size={22} fill="currentColor" />
               </div>
               <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
            </div>
            <p className="text-gray-400">Access your legal intelligence dashboard.</p>
          </div>

          {/* Login form block */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <div className="relative">
                {/* Mail vector icon */}
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  required
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="lawyer@firm.com"
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              {/* Row grouping label with forgot link redirection */}
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-cyan-500 hover:text-cyan-400 font-bold uppercase tracking-tighter">Forgot?</Link>
              </div>
              <div className="relative">
                {/* Lock vector icon */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  required
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 p-4 pl-12 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Feedback messages (Errors or success) */}
            <AnimatePresence>
              {/* Error feedback badge banner */}
              {errorMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                  <AlertCircle size={14} /> {errorMessage}
                </motion.div>
              )}
              {/* Success feedback badge banner */}
              {status === "success" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-green-400 text-xs bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                  <CheckCircle2 size={14} /> Authentication successful!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button displaying dynamic labels */}
            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full group bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? "Authenticating..." : (
                <>
                  Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Account creation redirect link */}
            <p className="text-center text-gray-500 text-sm mt-6">
              New to ACINA?{" "}
              <Link to="/signup" className="text-white font-bold hover:text-cyan-400 transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}