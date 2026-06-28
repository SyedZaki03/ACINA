// Import React core library
import React from "react";
// Import framer-motion modules for scroll and mount animation transitions
import { motion } from "framer-motion";
// Import required vector icons from lucide-react
import { Brain, ShieldCheck, FileText, Sparkles, Target, Users, Zap, Award } from "lucide-react";
// Import the common header Navbar component
import Navbar from "../components/Navbar";
// Import the common footer Footer component
import Footer from "../components/Footer";

// Reusable Value Card sub-component for layout maintenance
const ValueCard = ({ icon: Icon, title, desc, delay }) => (
  // Animated container using motion.div
  <motion.div
    // Set entry animations (initially invisible, shifted down)
    initial={{ opacity: 0, y: 20 }}
    // Trigger visible state when in viewport scroll range
    whileInView={{ opacity: 1, y: 0 }}
    // Ensure viewport animation runs only once
    viewport={{ once: true }}
    // Set transition duration and sequential delay timings
    transition={{ delay, duration: 0.5 }}
    // Apply styling (padded borders, slate backgrounds, custom hover borders, and transitions)
    className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all group text-center"
  >
    {/* Highlighted icon container with hover color inversions */}
    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-6 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
      <Icon size={28} />
    </div>
    {/* Value Card Title */}
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    {/* Description copy text block */}
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// Export default AboutPage functional page component
export default function AboutPage() {
  return (
    // Outer flex column page layout wrapper (dark navy background)
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20">
        
        {/* --- HERO SECTION --- */}
        {/* Public mission hero section */}
        <section className="px-6 md:px-20 mb-24 text-center">
          {/* Hero animation container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title heading in multi-color gradient */}
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
              Human Expertise, <br /> AI Intelligence.
            </h1>
            {/* Vision description copy text */}
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              ACINA isn't just about replacing manual labor—it's about augmenting legal professionals with the most advanced intelligence available today.
            </p>
          </motion.div>
        </section>

        {/* --- THE CORE MISSION (BENTO STYLE) --- */}
        {/* Bento grid showcase block */}
        <section className="px-6 md:px-20 max-w-7xl mx-auto mb-32">
          {/* Outer bento container wrapping text left and metric block cards right */}
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/30 border border-slate-800 rounded-[3rem] p-10 md:p-16 overflow-hidden relative">
            {/* Backdrop blur graphic layer */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            
            {/* Left text column */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Redefining the <span className="text-cyan-400 font-serif italic">Contract Lifecycle</span></h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  In a world of complex compliance and rapid negotiation, traditional legal workflows are the bottleneck of business growth. ACINA was born to dissolve those barriers.
                </p>
                <p>
                  By leveraging state-of-the-art <strong>Large Language Models (LLMs)</strong> and proprietary legal datasets, we provide a structured logic layer that ensures every clause is scrutinized for risk and optimized for success.
                </p>
              </div>
            </div>

            {/* Right bento items columns */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* Bento 1: Tech stack details */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="text-3xl font-bold text-cyan-400 mb-1">MERN</div>
                <div className="text-xs uppercase text-gray-500 font-bold tracking-widest">Architecture</div>
              </div>
              {/* Bento 2: Encryption standards */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="text-3xl font-bold text-blue-500 mb-1">256-bit</div>
                <div className="text-xs uppercase text-gray-500 font-bold tracking-widest">Encryption</div>
              </div>
              {/* Bento 3: AI Engine */}
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 col-span-2 text-center">
                <div className="text-3xl font-bold text-purple-500 mb-1">Neural AI</div>
                <div className="text-xs uppercase text-gray-500 font-bold tracking-widest">Logic Engine</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- OUR CORE VALUES --- */}
        {/* Values listing section */}
        <section className="px-6 md:px-20 max-w-7xl mx-auto mb-32">
          {/* Section heading text */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The ACINA Core</h2>
            <p className="text-gray-500">The principles that drive our engineering and legal research.</p>
          </div>
          {/* Grid layout containing 4 values cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon={Target} title="Precision" desc="Zero tolerance for ambiguity in legal drafting and risk scoring." delay={0.1} />
            <ValueCard icon={Users} title="Inclusion" desc="Making high-level legal intelligence accessible to startups and giants alike." delay={0.2} />
            <ValueCard icon={Zap} title="Velocity" desc="Reducing the time-to-signature from weeks to mere minutes." delay={0.3} />
            <ValueCard icon={Award} title="Integrity" desc="Ethical AI models trained to prioritize legal compliance above all." delay={0.4} />
          </div>
        </section>

        {/* --- TECHNICAL BREAKDOWN SECTION --- */}
        {/* Technical architecture explanation section */}
        <section className="px-6 md:px-20 mb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            {/* Left Column: Image wrapper layout */}
            <div className="order-2 lg:order-1 relative">
              {/* Radial glow background layer */}
              <div className="absolute -inset-10 bg-blue-600/10 blur-[120px] rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
                alt="AI Secure Tech"
                className="rounded-3xl border border-slate-800 shadow-2xl relative z-10"
              />
            </div>
            {/* Right Column: Key technical features listing */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
                <div className="w-10 h-0.5 bg-cyan-400" /> Technical Excellence
              </h2>
              {/* Technical point items list */}
              <div className="space-y-8">
                {[
                  { icon: Brain, t: "Contextual LLMs", d: "Our models don't just read words; they understand the intent and legal obligations behind them." },
                  { icon: ShieldCheck, t: "Enterprise Security", d: "Role-based access control (RBAC) ensures your sensitive data stays within your organization." },
                  { icon: Sparkles, t: "Hybrid Logic", d: "A combination of neural networks and rigid legal rule-based validation." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    {/* Render corresponding icon */}
                    <div className="text-cyan-400 shrink-0 mt-1"><item.icon size={24} /></div>
                    {/* Render description text details */}
                    <div>
                      <h4 className="font-bold text-white mb-2">{item.t}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- OUR VISION FOR THE FUTURE --- */}
        {/* Roadmap callout section */}
        <section className="px-6 md:px-20">
          {/* Animated gradient outline container card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-cyan-900/40 border border-slate-700/50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8">Looking Forward</h2>
              {/* Future description text */}
              <p className="text-gray-300 max-w-4xl mx-auto text-lg leading-8 mb-10">
                Our roadmap takes us beyond simple drafting. We are building a global 
                <strong> Contract Lifecycle Management (CLM)</strong> ecosystem that handles 
                everything from the first hello to the final post-execution audit.
              </p>
              {/* Horizontal roadmap pill badges */}
              <div className="flex flex-wrap justify-center gap-4">
                <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm">Drafting</span>
                <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm">Review</span>
                <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm">Negotiation</span>
                <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm">Post-Execution Analytics</span>
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}