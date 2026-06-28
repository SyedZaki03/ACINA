// Import React and hooks for managing template states and inputs
import React, { useState } from "react";
// Import motion and presence wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import useNavigate and useLocation hooks from react-router-dom to navigate dashboard views
import { useNavigate, useLocation } from "react-router-dom";
// Import required vector icons from lucide-react library
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Users, 
  FileText, 
  RotateCcw, 
  Wand2, 
  ChevronRight,
  Download,
  Copy,
  Check,
  AlertTriangle
} from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

// Export default GenerateContract functional page component
export default function GenerateContract() {
  // Navigation hook
  const navigate = useNavigate();
  // Location hook to read transition parameters
  const location = useLocation();
  // Retrieve current active theme variables
  const { theme } = useTheme();

  // Read selected template category parameter passed by templates redirection, default to "Mutual NDA"
  const selectedTemplate = location.state?.template || "Mutual NDA";

  // Form input state parameters initialization
  const [category, setCategory] = useState(selectedTemplate);
  const [governingLaw, setGoverningLaw] = useState("New York, USA");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [tone, setTone] = useState("Balanced");
  const [covenants, setCovenants] = useState("");

  // States tracking API drafting operations
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("input"); // Active views: 'input' or 'preview'
  const [draftResult, setDraftResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Action method to dispatch parameters to draft API endpoint
  const handleGenerate = async (e) => {
    e.preventDefault();
    // Trigger loading status
    setIsGenerating(true);
    // Clear old errors and drafts
    setError("");
    setDraftResult("");

    const token = localStorage.getItem("access_token");
    // Validate session credentials
    if (!token) {
      setError("Authentication required. Please login again.");
      setIsGenerating(false);
      return;
    }

    try {
      // POST drafting request details
      const response = await fetch("http://localhost:8000/contracts/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          governingLaw,
          partyA,
          partyB,
          tone,
          covenants
        })
      });

      // Parse JSON response body
      const data = await response.json();
      // Block flow on server errors
      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to generate contract");
      }

      // Save generated contract string details
      setDraftResult(data.draft);
      // Toggle view to preview tab page
      setActiveTab("preview");
    } catch (err) {
      // Capture and display error details
      console.error(err);
      setError(err.message || "Failed to connect to drafting server.");
    } finally {
      // Turn off loading status
      setIsGenerating(false);
    }
  };

  // Helper method to clear all input parameters to default states
  const handleReset = () => {
    setCategory("Mutual NDA");
    setGoverningLaw("New York, USA");
    setPartyA("");
    setPartyB("");
    setTone("Balanced");
    setCovenants("");
    setDraftResult("");
    setError("");
    setActiveTab("input");
  };

  // Helper method to copy generated draft details to clipboard
  const handleCopy = () => {
    if (!draftResult) return;
    navigator.clipboard.writeText(draftResult);
    setCopied(true);
    // Revert icon badge back to copy status after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper method to download generated draft text as markdown file attachment
  const handleDownload = () => {
    if (!draftResult) return;
    // Create temporary download element link
    const element = document.createElement("a");
    // Build binary blob carrying draft contents
    const file = new Blob([draftResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    // Format download filename
    element.download = `${category.replace(/\s+/g, "_")}_Draft.md`;
    document.body.appendChild(element);
    // Simulate user click
    element.click();
    // Clean up temporary DOM element
    document.body.removeChild(element);
  };

  return (
    // Outer page layout wrapper carrying theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-300`}>
      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* Header navigation bar */}
        <div className="flex justify-between items-start mb-10">
          {/* Title description block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              Drafting Suite <span className="text-cyan-600 dark:text-cyan-400">Builder</span> <Sparkles className="text-cyan-600 dark:text-cyan-400" size={32} />
            </h1>
            <p className="text-slate-500 dark:text-gray-500 mt-2 font-medium">
              Specify your parameters and let ACINA Intelligence handle the legal architecture.
            </p>
          </motion.div>

          {/* Toggle buttons switching between parameters form and live previews */}
          <div className="flex bg-white dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button 
              onClick={() => setActiveTab("input")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'input' ? 'bg-cyan-500 text-white dark:text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Parameters
            </button>
            <button 
              onClick={() => setActiveTab("preview")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-cyan-500 text-white dark:text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Live Draft
            </button>
          </div>
        </div>

        {/* Form and Preview panels grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: FORM PARAMETERS --- */}
          {/* Parameter input panel container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Action form */}
            <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl space-y-8">
              
              {/* Step 1: Core Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest">
                  <FileText size={14} /> Step 1: Document Foundation
                </div>
                {/* Inputs for Category and Governing jurisdictions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select category dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-gray-400 ml-1">Contract Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white transition-all"
                    >
                      <option value="Mutual NDA">Mutual NDA</option>
                      <option value="Master Service Agreement (MSA)">Master Service Agreement (MSA)</option>
                      <option value="SaaS Subscription Agreement">SaaS Subscription Agreement</option>
                      <option value="Employment (Executive)">Employment (Executive)</option>
                    </select>
                  </div>
                  {/* Jurisdiction text input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-gray-400 ml-1">Governing Law</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-600" size={16} />
                      <input
                        type="text"
                        value={governingLaw}
                        onChange={(e) => setGoverningLaw(e.target.value)}
                        placeholder="e.g. New York, USA"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Entities */}
              {/* Entity name inputs */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest">
                  <Users size={14} /> Step 2: Contracting Parties
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Party A name */}
                  <input 
                    placeholder="Party A (Discloser)" 
                    value={partyA}
                    onChange={(e) => setPartyA(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white" 
                  />
                  {/* Party B name */}
                  <input 
                    placeholder="Party B (Receiver)" 
                    value={partyB}
                    onChange={(e) => setPartyB(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white" 
                  />
                </div>
              </div>

              {/* Step 3: AI Intelligence Toggles */}
              {/* Select drafting tone */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest">
                  <Wand2 size={14} /> Step 3: Intelligence Profile
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['Balanced', 'Aggressive', 'Pro-Discloser'].map((t) => (
                    <button 
                      type="button" 
                      key={t} 
                      onClick={() => setTone(t)}
                      className={`p-3 rounded-xl border transition-all text-[10px] font-bold uppercase ${tone === t ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special instructions comments box */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-bold text-slate-500 dark:text-gray-400 ml-1">Special Covenants / Notes</label>
                <textarea
                  rows="4"
                  value={covenants}
                  onChange={(e) => setCovenants(e.target.value)}
                  placeholder="e.g. Include a non-solicit clause for 24 months..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              {/* Error messages banner display */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-3">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              {/* Submit and reset action button controls */}
              <div className="flex justify-end gap-4 pt-6">
                {/* Reset button */}
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all font-bold text-sm"
                >
                  <RotateCcw size={16} /> Reset
                </button>
                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={isGenerating || !partyA || !partyB}
                  className="flex items-center gap-2 px-10 py-3 rounded-2xl bg-cyan-500 text-white dark:text-slate-950 font-black text-sm hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Processing..." : "Generate Architecture"} <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* --- RIGHT: LIVE PREVIEW --- */}
          {/* Live drafting preview viewport */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 relative"
          >
            {/* Sticky viewport container card */}
            <div className="sticky top-8 bg-white dark:bg-[#050a18] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 min-h-[700px] shadow-xl dark:shadow-2xl flex flex-col">
              {/* Draft status header */}
              <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest">
                  <ShieldCheck size={14} className="text-green-500" /> Draft Status: {isGenerating ? 'Structuring...' : (draftResult ? 'Complete' : 'Pending')}
                </span>
                {/* Copy & download action indicators */}
                {draftResult && (
                  <div className="flex gap-2">
                    {/* Copy to clipboard */}
                    <button 
                      onClick={handleCopy} 
                      title="Copy to Clipboard"
                      className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                    >
                      {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                    </button>
                    {/* Download file attachment */}
                    <button 
                      onClick={handleDownload} 
                      title="Download Markdown File"
                      className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                    >
                      <Download size={16}/>
                    </button>
                  </div>
                )}
              </div>

              {/* Main result preview area mapping loading and empty states */}
              <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                <AnimatePresence mode="wait">
                  {/* If generating draft, show spinner */}
                  {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                      <p className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">Structuring Clauses...</p>
                    </motion.div>
                  ) : draftResult ? (
                    // If draft generated successfully, display document text
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="w-full text-left space-y-6 overflow-y-auto max-h-[550px] pr-4 custom-scrollbar"
                    >
                      <h3 className="text-slate-800 dark:text-white font-bold text-lg text-center uppercase underline underline-offset-8 decoration-cyan-500/50 mb-10">{category}</h3>
                      <div className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-900">
                        {draftResult}
                      </div>
                    </motion.div>
                  ) : (
                    // Else show awaiting placeholder
                    <div className="space-y-4 opacity-25 text-slate-400">
                      <FileText size={64} className="mx-auto" />
                      <p className="font-bold text-sm tracking-widest uppercase">Awaiting Parameters</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}