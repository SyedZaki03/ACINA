// Import React core library
import React from "react";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import required vector icons from lucide-react library
import { Brain, ShieldCheck, FileText, Sparkles, ArrowRight, Zap, CheckCircle, BarChart3 } from "lucide-react";
// Import useNavigate navigation hook from react-router-dom
import { useNavigate } from "react-router-dom";
// Import common Navbar header
import Navbar from "../components/Navbar";
// Import common Footer elements
import Footer from "../components/Footer";

// Reusable BentoItem sub-component for rendering value propositions in a bento grid
const BentoItem = ({ icon: Icon, title, desc, delay }) => (
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
    className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all group"
  >
    {/* Icon circle wrapper carrying hover zoom animation transitions */}
    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    {/* Bento Card Title */}
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    {/* Bento Card Description copy text */}
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// Export default LandingPage functional page component
export default function LandingPage() {
  // Navigation hook
  const navigate = useNavigate();

  return (
    // Outer page layout wrapper (dark navy background, custom selection styling)
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="pt-20">
        
        {/* --- HERO SECTION --- */}
        {/* Hero title, tag, and call-to-action buttons */}
        <section className="relative px-6 pt-24 pb-32 md:px-20 overflow-hidden">
          {/* Background blurred color glow layers */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full" />
          </div>

          {/* Centered context block */}
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Animated product tag badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Zap size={14} fill="currentColor" /> The Next Era of Legal Tech
            </motion.div>

            {/* Main title header carrying gradient background fills */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]"
            >
              Contracts that <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">think for you.</span>
            </motion.h1>

            {/* Description copy text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              ACINA leverages proprietary AI to draft, analyze, and negotiate complex legal agreements in seconds. Reduce legal overhead by 70%.
            </motion.p>

            {/* Action buttons triggers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
            >
              {/* Primary Start button linking to signup */}
              <button
                onClick={() => navigate("/signup")}
                className="px-10 py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_-5px_rgba(34,211,238,0.4)] transition-all active:scale-95"
              >
                Start for Free <ArrowRight size={20} />
              </button>
              {/* Secondary Demo watch button linking to about */}
              <button
                onClick={() => navigate("/about")}
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold active:scale-95"
              >
                Watch Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* --- TRUST BANNER (FIXED VISIBILITY) --- */}
        {/* Grid panel showing mock customer logos */}
        <section className="py-16 border-y border-slate-900 bg-slate-950/80 relative z-10">
          <p className="text-center text-cyan-500/80 text-xs font-bold uppercase tracking-[0.4em] mb-10">
            Trusted by Forward-Thinking Teams
          </p>
          {/* Logo rows */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 px-6 opacity-70">
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-white/80 hover:text-cyan-400 transition-colors cursor-default">LEXGLOBAL</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-white/80 hover:text-cyan-400 transition-colors cursor-default">FINSEC</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-white/80 hover:text-cyan-400 transition-colors cursor-default">TERRA_LAW</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-white/80 hover:text-cyan-400 transition-colors cursor-default">AETHER</span>
          </div>
        </section>

        {/* --- FEATURE BENTO GRID --- */}
        {/* Core product capabilities grid */}
        <section className="px-6 md:px-20 py-32 max-w-7xl mx-auto">
          {/* Section heading text */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Master the lifecycle.</h2>
            <p className="text-gray-400 max-w-xl mx-auto italic">Everything you need to automate your legal operations in one platform.</p>
          </div>

          {/* Bento grid layout mapping bento items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BentoItem 
              icon={Brain} 
              title="Predictive Risk" 
              desc="Identify potential litigation before it happens with our neural risk-scoring engine."
              delay={0.1}
            />
            <BentoItem 
              icon={FileText} 
              title="Automated Drafting" 
              desc="Generate complex MSAs, NDAs, and SLAs using intelligent jurisdictional logic."
              delay={0.2}
            />
            <BentoItem 
              icon={ShieldCheck} 
              title="Audit Trails" 
              desc="Complete immutable logs of every clause change and negotiation step taken."
              delay={0.3}
            />
            <BentoItem 
              icon={BarChart3} 
              title="Analytics" 
              desc="Track contract turnaround times and optimize negotiation bottlenecks."
              delay={0.4}
            />
            <BentoItem 
              icon={Sparkles} 
              title="Smart Suggestions" 
              desc="Get real-time clause alternatives based on your organization's preferred legal playbooks."
              delay={0.5}
            />
            <BentoItem 
              icon={CheckCircle} 
              title="Instant Compliance" 
              desc="Cross-reference any document against GDPR, CCPA, and regional regulations automatically."
              delay={0.6}
            />
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        {/* Full-width callout signup banner */}
        <section className="px-6 md:px-20 pb-32">
          {/* Animated gradient container card */}
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="p-12 md:p-24 rounded-[3rem] bg-gradient-to-br from-blue-600 to-cyan-500 text-center text-slate-950 relative overflow-hidden"
          >
            {/* Backdrop visual circle overlay */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Stop drafting from scratch.</h2>
            <p className="text-slate-900/80 font-medium text-lg max-w-xl mx-auto mb-12 relative z-10">
              Join thousands of legal teams building a faster, safer, and smarter legal future with ACINA.
            </p>
            {/* Primary signup action button redirection */}
            <button 
              onClick={() => navigate("/signup")}
              className="px-12 py-5 rounded-2xl bg-slate-950 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl relative z-10"
            >
              Get Started for Free
            </button>
          </motion.div>
        </section>
      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}