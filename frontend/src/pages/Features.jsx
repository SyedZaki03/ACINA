// Import React core library
import React from "react";
// Import Link to navigate internal pages without reload cycles
import { Link } from "react-router-dom";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import required vector icons from lucide-react library
import { 
  Brain, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Globe, 
  Lock, 
  Cpu, 
  ChevronRight 
} from "lucide-react";
// Import common Navbar header
import Navbar from "../components/Navbar";
// Import common Footer elements
import Footer from "../components/Footer";

// Reusable Feature Card sub-component for showcase grid layout
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  // Animated container using motion.div
  <motion.div
    // Set entry animations (initially invisible, shifted down)
    initial={{ opacity: 0, y: 20 }}
    // Trigger visible state when in viewport scroll range
    whileInView={{ opacity: 1, y: 0 }}
    // Ensure viewport animation runs only once
    viewport={{ once: true }}
    // Set transition duration and delay timings
    transition={{ delay, duration: 0.5 }}
    // Card styles mapping hover borders and transition timings
    className="group relative p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300"
  >
    {/* Absolute hover gradient highlight layer */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
    {/* Content z-aligned wrapper */}
    <div className="relative z-10">
      {/* Icon bubble wrapper with hover zoom effects */}
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      {/* Feature Card Title */}
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      {/* Feature description copy text */}
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// Export default FeaturesPage functional component
export default function FeaturesPage() {
  // Pre-configured list of primary features metrics
  const primaryFeatures = [
    { 
      icon: FileText, 
      title: "Contract Draft Generation", 
      desc: "Instantly generate ironclad legal documents using our library of 500+ jurisdictional templates." 
    },
    { 
      icon: Brain, 
      title: "Intelligent Risk Analyzer", 
      desc: "Advanced NLP scans for hidden liabilities and non-standard clauses in seconds, not hours." 
    },
    { 
      icon: Sparkles, 
      title: "Negotiation Assistant", 
      desc: "Real-time clause suggestions based on historical data and preferred legal positions." 
    },
    { 
      icon: ShieldCheck, 
      title: "Secure Repository", 
      desc: "AES-256 encrypted storage with granular permissions and automated version control." 
    },
    { 
      icon: Zap, 
      title: "Lightning Fast OCR", 
      desc: "Convert scanned PDFs into searchable, editable, and analyzable smart data." 
    },
    { 
      icon: Globe, 
      title: "Multi-Lingual Support", 
      desc: "Draft and analyze contracts across 30+ languages with contextual legal nuance." 
    },
  ];

  return (
    // Outer flex column page layout wrapper (dark navy background)
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20">
        
        {/* --- SECTION 1: HERO --- */}
        {/* Hero tag and title block */}
        <section className="px-6 md:px-20 mb-32 text-center">
          {/* Animated category tags badge */}
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block"
          >
            The New Standard in Legal Ops
          </motion.span>
          {/* Animated main header title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
          >
            Intelligence at every <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">clause and comma.</span>
          </motion.h1>
          {/* Hero description text */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            ACINA isn't just a repository; it's a living AI partner that understands 
            the "why" behind your legal language.
          </p>
        </section>

        {/* --- SECTION 2: STATS BANNER --- */}
        {/* Statistics list grid overlay */}
        <div className="border-y border-slate-800 bg-slate-900/20 py-12 mb-32">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  ["90%", "Faster Drafting"], 
                  ["40%", "Risk Reduction"], 
                  ["10k+", "Clauses Analyzed"], 
                  ["24/7", "AI Availability"]
                ].map(([stat, label], i) => (
                    <div key={i}>
                        {/* Render numeric metric percentage */}
                        <div className="text-3xl font-bold text-cyan-400">{stat}</div>
                        {/* Render metric label text */}
                        <div className="text-gray-500 text-sm mt-1">{label}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- SECTION 3: CORE FEATURES GRID --- */}
        {/* Core feature cards panel mapping */}
        <section className="px-6 md:px-20 max-w-7xl mx-auto mb-32">
          {/* Section heading text with linking CTA to about page */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Core Platform Capabilities</h2>
              <p className="text-gray-400">Everything you need to move from "First Draft" to "Signed" in record time.</p>
            </div>
            <Link to="/about" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-2">
              Learn about our mission <ChevronRight size={18} />
            </Link>
          </div>
          
          {/* Map of the primaryFeatures list to the reusable FeatureCard component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primaryFeatures.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* --- SECTION 4: TECHNICAL HIGHLIGHT (Bento Style) --- */}
        {/* Bento-style technical point-outs */}
        <section className="px-6 md:px-20 mb-32">
          <div className="bg-gradient-to-b from-slate-900 to-transparent border border-slate-800 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16">
            {/* Left points listing */}
            <div className="lg:w-1/2">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                <Cpu className="text-white" size={24} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Built on MERN. <br/>Powered by Neural Networks.</h2>
              <ul className="space-y-6">
                {[
                  { t: "Predictive Analytics", d: "Forecast potential litigation points before they arise." },
                  { t: "Automated Compliance", d: "Real-time checks against GDPR, HIPAA, and CCPA." },
                  { t: "Smart Integrations", d: "Sync seamlessly with Slack, DocuSign, and Google Drive." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <div>
                      <span className="block font-bold text-white">{item.t}</span>
                      <span className="text-gray-400 text-sm">{item.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right illustration wrapper */}
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full" />
               <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" 
                alt="AI Data Visualization Dashboard" 
                className="relative rounded-2xl border border-slate-700 shadow-2xl"
               />
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FINAL CALL TO ACTION --- */}
        {/* Sign-up banner with green/cyan gradient wrap */}
        <section className="px-6 md:px-20">
            <div className="bg-cyan-500 rounded-[2.5rem] p-12 md:p-20 text-center text-slate-950 overflow-hidden relative">
                {/* Backdrop radial halo graphic layer */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                
                <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">
                  Ready to automate your <br/>legal workflow?
                </h2>
                
                <p className="text-slate-900/80 font-medium mb-10 max-w-xl mx-auto relative z-10">
                  Join 500+ legal teams using ACINA to reclaim 20+ hours of drafting time every single week.
                </p>
                
                {/* Action CTA link buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <Link 
                      to="/signup" 
                      className="bg-slate-950 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 text-center"
                    >
                      Get Started Now
                    </Link>
                    <Link 
                      to="/about" 
                      className="bg-transparent border-2 border-slate-950/20 px-10 py-4 rounded-xl font-bold hover:bg-slate-950/5 transition-all active:scale-95 text-center"
                    >
                      About Us
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}