// Import React core library
import React from "react";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import required vector icons from lucide-react library
import { ShieldCheck, Lock, Eye, Database, Server, Key, FileLock, ClipboardCheck } from "lucide-react";
// Import common Navbar header
import Navbar from "../components/Navbar";
// Import common Footer elements
import Footer from "../components/Footer";

// Reusable Security Card sub-component for rendering defensive features grid
const SecurityCard = ({ icon: Icon, title, desc, delay }) => (
  // Animated container using motion.div
  <motion.div
    // Set entry animations (initially invisible, shifted down)
    initial={{ opacity: 0, y: 20 }}
    // Trigger visible state when in viewport scroll range
    whileInView={{ opacity: 1, y: 0 }}
    // Ensure viewport animation runs only once
    viewport={{ once: true }}
    // Configure transition duration and delay timings
    transition={{ delay, duration: 0.5 }}
    // Card styles mapping hover borders and transition timings
    className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all group"
  >
    {/* Icon circle wrapper carrying hover zoom animation transitions */}
    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    {/* Security Card Title */}
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    {/* Description copy text block */}
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// Export default Security functional page component
export default function Security() {
  return (
    // Outer flex column page layout wrapper (dark navy background)
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-20">
        
        {/* --- HERO SECTION --- */}
        {/* Public mission hero section */}
        <section className="max-w-4xl mx-auto text-center mb-24">
          {/* Animated category tag badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <ShieldCheck size={14} /> Enterprise-Grade Defense
          </motion.div>
          {/* Animated main header title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Your data, <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">fortified by design.</span>
          </motion.h1>
          {/* Description copy text */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            At ACINA, we understand that legal documents are your most sensitive assets. 
            We build our platform on a foundation of zero-trust architecture.
          </p>
        </section>

        {/* --- SECURITY PILLARS --- */}
        {/* Row grid listing 4 security cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-32">
          <SecurityCard 
            icon={Lock} 
            title="AES-256 Encryption" 
            desc="Data is encrypted at rest and in transit using industry-standard protocols." 
            delay={0.1}
          />
          <SecurityCard 
            icon={Key} 
            title="Role-Based Access" 
            desc="Granular permissions ensure that only authorized personnel can view specific clauses." 
            delay={0.2}
          />
          <SecurityCard 
            icon={Database} 
            title="Data Residency" 
            desc="Regional data hosting options to comply with local privacy regulations like GDPR." 
            delay={0.3}
          />
          <SecurityCard 
            icon={FileLock} 
            title="Immutable Logs" 
            desc="Every document interaction is timestamped and logged for full audit transparency." 
            delay={0.4}
          />
        </div>

        {/* --- DATA FLOW VISUAL SECTION --- */}
        {/* Bento style details listing three core protective systems */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="bg-gradient-to-b from-slate-900 to-transparent border border-slate-800 rounded-[3rem] p-10 md:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column: Numbered points mapping protections */}
              <div>
                <h2 className="text-3xl font-bold mb-6">How we protect your lifecycle</h2>
                <div className="space-y-8">
                  {/* Point 1 */}
                  <div className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                    <div>
                      <h4 className="font-bold mb-2">TLS 1.3 Transmission</h4>
                      <p className="text-gray-400 text-sm">All communication between your browser and our servers is tunneled through TLS 1.3 encrypted sockets.</p>
                    </div>
                  </div>
                  {/* Point 2 */}
                  <div className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                    <div>
                      <h4 className="font-bold mb-2">Isolated Containers</h4>
                      <p className="text-gray-400 text-sm">Your data lives in isolated virtual environments, ensuring no leakage between tenant accounts.</p>
                    </div>
                  </div>
                  {/* Point 3 */}
                  <div className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                    <div>
                      <h4 className="font-bold mb-2">Penetration Testing</h4>
                      <p className="text-gray-400 text-sm">We conduct regular third-party security audits and penetration tests to stay ahead of vulnerabilities.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column: Illustration image container with mask glows */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3" 
                  alt="Cybersecurity Operations" 
                  className="relative rounded-2xl border border-slate-700 shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- COMPLIANCE GRID --- */}
        {/* Compliance standards logo display panel */}
        <section className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12">Global Standards Compliance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            {/* GDPR standard */}
            <div className="flex flex-col items-center gap-3">
              <ClipboardCheck className="text-blue-400" size={40} />
              <span className="font-bold text-xs uppercase tracking-widest">GDPR</span>
            </div>
            {/* SOC 2 standard */}
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="text-blue-400" size={40} />
              <span className="font-bold text-xs uppercase tracking-widest">SOC 2 Type II</span>
            </div>
            {/* ISO standard */}
            <div className="flex flex-col items-center gap-3">
              <Server className="text-blue-400" size={40} />
              <span className="font-bold text-xs uppercase tracking-widest">ISO 27001</span>
            </div>
            {/* CCPA standard */}
            <div className="flex flex-col items-center gap-3">
              <Eye className="text-blue-400" size={40} />
              <span className="font-bold text-xs uppercase tracking-widest">CCPA</span>
            </div>
          </div>
        </section>

      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}