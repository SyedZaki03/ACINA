// Import React core library
import React from "react";
// Import motion animation hooks from framer-motion library
import { motion } from "framer-motion";
// Import required vector icons from lucide-react library
import { Shield, Lock, Eye, FileText, UserCheck, Globe } from "lucide-react";
// Import the common header Navbar component
import Navbar from "../components/Navbar";
// Import the common footer Footer component
import Footer from "../components/Footer";

// Reusable Policy Section component
const PolicySection = ({ icon: Icon, title, children }) => (
  // Outer margin divider block
  <div className="mb-12">
    {/* Inner flex row for section header and icon */}
    <div className="flex items-center gap-3 mb-4">
      {/* Light cyan icon circle wrapper */}
      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
        <Icon size={22} />
      </div>
      {/* Render Section Title */}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {/* Render Section paragraphs and lists body container */}
    <div className="text-gray-400 leading-relaxed space-y-4 pl-1">
      {children}
    </div>
  </div>
);

// Export default PrivacyPolicy page functional component
export default function PrivacyPolicy() {
  return (
    // Outer flex column page layout wrapper (dark navy background)
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-20 max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        {/* Animated header section with entry transition rules */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-slate-800 pb-12"
        >
          {/* Main Title heading styled in cyan blue gradient */}
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          {/* Version details indicators */}
          <p className="text-gray-500 font-medium">
            Last Updated: January 2026 • Version 2.1
          </p>
        </motion.div>

        {/* --- DATA MINIMIZATION SUMMARY --- */}
        {/* Grid panel highlighting three core compliance features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Encrypted storage metric card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <Lock className="text-cyan-400 mb-3" size={24} />
            <h4 className="font-bold text-sm mb-1">Encrypted Storage</h4>
            <p className="text-xs text-gray-500">AES-256 bit encryption at rest.</p>
          </div>
          {/* Data ownership metric card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <UserCheck className="text-cyan-400 mb-3" size={24} />
            <h4 className="font-bold text-sm mb-1">Data Ownership</h4>
            <p className="text-xs text-gray-500">You retain 100% rights to your files.</p>
          </div>
          {/* GDPR compliance metric card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <Globe className="text-cyan-400 mb-3" size={24} />
            <h4 className="font-bold text-sm mb-1">GDPR Compliant</h4>
            <p className="text-xs text-gray-500">Strict EU data protection standards.</p>
          </div>
        </div>

        {/* --- POLICY CONTENT --- */}
        {/* Content sections list */}
        <section>
          {/* Section 1: Information We Collect */}
          <PolicySection icon={FileText} title="1. Information We Collect">
            <p>
              ACINA collects minimal personal information necessary to provide our services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and professional credentials.</li>
              <li><strong>Usage Data:</strong> Log data, IP addresses, and device information for security monitoring.</li>
              <li><strong>Document Data:</strong> Content of contracts uploaded for AI analysis (stored securely and never used for public model training without explicit consent).</li>
            </ul>
          </PolicySection>

          {/* Section 2: How We Use Your Data */}
          <PolicySection icon={Shield} title="2. How We Use Your Data">
            <p>
              Your data is used strictly to provide and improve the ACINA platform:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To perform AI-driven risk analysis and contract drafting.</li>
              <li>To provide customer support and technical troubleshooting.</li>
              <li>To comply with legal obligations and prevent fraudulent activity.</li>
            </ul>
          </PolicySection>

          {/* Section 3: Data Retention & Security */}
          <PolicySection icon={Lock} title="3. Data Retention & Security">
            <p>
              We retain your data only as long as your account is active. We implement enterprise-grade security including:
            </p>
            <p>
              All data transmitted is secured via TLS 1.3. Documents are stored in isolated databases with no cross-tenant access. Upon account deletion, all associated files are purged from our servers within 30 days.
            </p>
          </PolicySection>

          {/* Section 4: Your Rights */}
          <PolicySection icon={Eye} title="4. Your Rights (GDPR/CCPA)">
            <p>
              Under global privacy laws, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of all data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate information.</li>
              <li><strong>Right to Erasure:</strong> Request the deletion of your account and all associated data.</li>
              <li><strong>Right to Portability:</strong> Export your contract data in structured formats.</li>
            </ul>
          </PolicySection>
        </section>

        {/* --- CONTACT FOOTNOTE --- */}
        {/* Privacy team outreach card */}
        <div className="mt-20 p-10 rounded-3xl bg-blue-900/10 border border-blue-500/20 text-center">
          <h3 className="text-xl font-bold mb-4">Privacy Questions?</h3>
          <p className="text-gray-400 mb-6">Our Data Protection Officer (DPO) is available to answer your concerns.</p>
          <a href="mailto:privacy@acina.com" className="text-cyan-400 hover:underline font-semibold">
            privacy@acina.com
          </a>
        </div>

      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}