// Import React and hooks for managing billing frequency states
import React, { useState } from "react";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import checkmark icon from lucide-react
import { Check } from "lucide-react";
// Import common Navbar header
import Navbar from "../components/Navbar";
// Import common Footer elements
import Footer from "../components/Footer";

// Export default Pricing functional page component
export default function Pricing() {
  // State variable controlling the selection between annual and monthly pricing
  const [isAnnual, setIsAnnual] = useState(true);

  // Setup list of mock pricing plans with custom feature tags and highlighting
  const plans = [
    {
      title: "Starter",
      price: "0",
      desc: "Perfect for students and legal researchers.",
      features: ["3 Contract Analyses / mo", "Basic Template Library", "Standard Support", "PDF Exports"],
      buttonText: "Get Started",
      highlight: false,
    },
    {
      title: "Professional",
      // Set conditional price based on billing toggle selection
      price: isAnnual ? "39" : "49",
      desc: "Advanced insights for legal professionals.",
      features: ["Unlimited Analyses", "AI Risk Scoring", "Negotiation Playbooks", "Priority Email Support", "Custom Branding"],
      buttonText: "Start Free Trial",
      highlight: true, // Professional tier pops out visually
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "For law firms and corporate legal teams.",
      features: ["Full CLM Integration", "Single Sign-On (SSO)", "Dedicated Account Manager", "Custom AI Training", "On-premise Options"],
      buttonText: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    // Outer page wrapper with dark blue gradient background
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-20">
        
        {/* Header Section */}
        {/* Animated header section with entry transition rules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
            Invest in Legal Precision
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Choose the plan that fits your workload. Save 20% with annual billing.
          </p>

          {/* Billing Frequency Toggle wrapper */}
          <div className="mt-10 flex items-center justify-center gap-4">
            {/* Monthly label state */}
            <span className={!isAnnual ? "text-white" : "text-gray-500"}>Monthly</span>
            {/* Toggle switch slider button */}
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-slate-800 rounded-full p-1 transition-all relative"
            >
              <div className={`w-5 h-5 bg-cyan-400 rounded-full transition-all ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            {/* Yearly label state */}
            <span className={isAnnual ? "text-white" : "text-gray-500"}>Yearly (Save 20%)</span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid list */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((p, i) => (
            // Animated card wrapper displaying specific delay factors
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              // Conditionally apply style enhancements to highlight Professional tier
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                p.highlight 
                ? "bg-blue-600/10 border-cyan-500 shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)] scale-105 z-10" 
                : "bg-slate-900/50 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Highlight pop badge for the Professional plan */}
              {p.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              )}
              
              {/* Plan Title */}
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              {/* Price displays */}
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">{p.price === "Custom" ? "" : "$"}</span>
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                {p.price !== "Custom" && <span className="text-gray-400">/mo</span>}
              </div>
              {/* Plan description copy text */}
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">{p.desc}</p>

              {/* Call-to-action trigger button */}
              <button className={`w-full py-4 rounded-xl font-bold mb-8 transition-all ${
                p.highlight 
                ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" 
                : "bg-white/10 text-white hover:bg-white/20"
              }`}>
                {p.buttonText}
              </button>

              {/* Features checklist container */}
              <ul className="space-y-4 flex-grow">
                {p.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                    {/* Checkmark icon */}
                    <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Customer trust validation banner */}
        <div className="mt-24 text-center border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold mb-4">Trusted by modern legal teams</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
             <span className="text-xl font-semibold">LEGALCORP</span>
             <span className="text-xl font-semibold">TECHLAW</span>
             <span className="text-xl font-semibold">ACINA GLOBAL</span>
          </div>
        </div>
      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}