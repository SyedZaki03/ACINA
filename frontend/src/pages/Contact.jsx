// Import React and useState hook to manage contact message states
import React, { useState } from "react";
// Import AnimatePresence and motion wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import vector icons from lucide-react library
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Shield, Zap, CheckCircle2, AlertCircle } from "lucide-react";
// Import common Navbar header
import Navbar from "../components/Navbar";
// Import common Footer elements
import Footer from "../components/Footer";

// Reusable Contact Info Item sub-component
const ContactInfoItem = ({ icon: Icon, label, value }) => (
  // Layout block mapping icons to labels
  <div className="flex items-start gap-4 group">
    {/* Highlighted icon wrapper container with hover color shifts */}
    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 shrink-0">
      <Icon size={20} />
    </div>
    {/* Label description details */}
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-gray-200 font-medium">{value}</p>
    </div>
  </div>
);

// Export default ContactPage functional component
export default function ContactPage() {
  // State tracking API request statuses (idle, loading, success, error)
  const [status, setStatus] = useState("idle");
  // State carrying forms parameters context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  // Handler for contact form submissions
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update state status to loading
    setStatus("loading");

    try {
      // Dispatch contact payload variables to backend server contact API
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Handle success status
      if (response.ok) {
        setStatus("success");
        // Clear forms input values
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        // Revert status to idle after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        // Mark status as error on failed statuses
        setStatus("error");
      }
    } catch (error) {
      // Log connection failures
      console.error("Connection Error:", error);
      setStatus("error");
    }
  };

  return (
    // Outer flex column page layout wrapper (dark navy background)
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-20">
        
        {/* --- HERO --- */}
        {/* Public mission hero section */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Let's talk <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Intelligence.</span>
          </motion.h1>
        </section>

        {/* Info grid mapping direct outreach and contact form input panels */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- SIDEBAR INFO --- */}
          {/* Left direct contact details sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Direct Channels Card wrapper */}
            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-8">Direct Channels</h2>
              <div className="space-y-8 relative z-10">
                <ContactInfoItem icon={Mail} label="Email Us" value="support@acina.com" />
                <ContactInfoItem icon={Phone} label="Call Sales" value="+92 300 1234567" />
                <ContactInfoItem icon={MapPin} label="Visit Office" value="ACINA HQ, Lahore, Pakistan" />
                <ContactInfoItem icon={Clock} label="Business Hours" value="Mon – Fri, 9:00 AM – 6:00 PM" />
              </div>
            </div>

            {/* Sub feature highlights grid list */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
                <Shield className="text-blue-400 mb-3 mx-auto" size={24} />
                <h4 className="font-bold text-sm">Secure Data</h4>
              </div>
              <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                <Zap className="text-cyan-400 mb-3 mx-auto" size={24} />
                <h4 className="font-bold text-sm">Fast Response</h4>
              </div>
            </div>
          </motion.div>

          {/* --- CONTACT FORM --- */}
          {/* Right inquiry form block */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative"
          >
            {/* Manage success state transitions smoothly */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                // Success screen panel template
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <CheckCircle2 size={64} className="text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-bold">Message Received!</h3>
                  <p className="text-gray-400 mt-2">Our legal-tech specialists will reach out shortly.</p>
                </motion.div>
              ) : (
                // Standard form inputs
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Full Name</label>
                    <input
                      required
                      value={formData.name}
                      type="text"
                      placeholder="John Doe"
                      className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  {/* Email address field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
                    <input
                      required
                      value={formData.email}
                      type="email"
                      placeholder="john@firm.com"
                      className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  {/* Inquiry Category Select dropdown */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Inquiry Type</label>
                    <select 
                      value={formData.subject}
                      className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option>General Inquiry</option>
                      <option>Request Enterprise Demo</option>
                      <option>Technical Support</option>
                      <option>Partnership Opportunity</option>
                    </select>
                  </div>

                  {/* Message body textarea */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-gray-500 ml-1">Message</label>
                    <textarea
                      required
                      value={formData.message}
                      rows="5"
                      placeholder="Tell us about your needs..."
                      className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  {/* Submit button displaying dynamic loading messages */}
                  <motion.button
                    disabled={status === "loading"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="md:col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? "Processing..." : <><Send size={18} /> Send Inquiry</>}
                  </motion.button>

                  {/* Contextual backend connection failure alert banner */}
                  {status === "error" && (
                    <div className="md:col-span-2 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                      <AlertCircle size={16} /> Connection failed. Please check your backend.
                    </div>
                  )}
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}