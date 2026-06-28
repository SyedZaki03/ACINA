// Import React and hooks for managing risk analysis states
import React, { useState } from "react";
// Import useNavigate to navigate between dashboard pages programmatically
import { useNavigate } from "react-router-dom";
// Import motion and presence wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react library
import {
  Upload,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Search,
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
  Lightbulb,
  BookOpen
} from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom API helper to run deep LLM explanations
import { fetchExplanation } from "../../services/contractService";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

// Export default RiskAnalysis functional page component
export default function RiskAnalysis() {
  // Navigation hook instantiation
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();
  // State tracking standard prediction classification execution status
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // State variable flagging analysis completion status
  const [analysisComplete, setAnalysisComplete] = useState(false);
  // State variable carrying selected browser PDF file details
  const [file, setFile] = useState(null);
  // State variable carrying optional manually pasted contract text
  const [textInput, setTextInput] = useState("");
  // State variable carrying standard prediction outputs (predicted class, confidence)
  const [analysisResult, setAnalysisResult] = useState(null);
  // State variable carrying upload, API, or connection error alerts
  const [error, setError] = useState("");
  // State tracking LLM deep explanation execution status
  const [isExplaining, setIsExplaining] = useState(false);
  // State variable carrying LLM explanation and risks analysis outcomes
  const [explanationResult, setExplanationResult] = useState(null);

  // Input change handler to validate selected PDF file attachments
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    // Restrict files that are not PDF
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid PDF file");
      setFile(null);
    }
  };

  // Handler for standard prediction classifications submissions
  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    // Block if no file has been selected
    if (!file) {
      setError("Please upload a PDF file to analyze");
      return;
    }

    // Trigger loading status
    setIsAnalyzing(true);
    // Clear old errors
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      // Enforce session presence validation checks
      if (!token) {
        setError("Authentication required. Please login again.");
        setIsAnalyzing(false);
        return;
      }

      // Create multipart FormData container
      const formData = new FormData();
      formData.append("file", file);

      // Perform POST query to backend analyze API endpoint
      const response = await fetch("http://localhost:8000/contracts/analyze", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      // Clear token and redirect to login page if unauthorized (expired token)
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      // Parse JSON response body
      const data = await response.json();

      // Block flow on server errors
      if (!response.ok) {
        setError(data.detail || data.error || "Analysis failed");
        setIsAnalyzing(false);
        return;
      }

      // Save classification data results
      setAnalysisResult(data);
      // Flag completion status
      setAnalysisComplete(true);
    } catch (err) {
      // Catch exceptions and log failure
      setError("Failed to connect to server. Please try again.");
      console.error(err);
    } finally {
      // Reset loading status
      setIsAnalyzing(false);
    }
  };

  // Handler for deep LLM explanations requests using the existing scanned contract analysis_id
  const handleExplain = async () => {
    // Block if no active analysis has been run yet
    if (!analysisResult || !analysisResult.analysis_id) {
      setError("Please perform a deep scan first");
      return;
    }

    // Trigger explanation loading status
    setIsExplaining(true);
    // Clear old error logs and results
    setError("");
    setExplanationResult(null);

    try {
      const token = localStorage.getItem("access_token");
      // Enforce session validation
      if (!token) {
        setError("Authentication required. Please login again.");
        setIsExplaining(false);
        return;
      }

      console.log("🔍 Starting explanation process for analysis ID:", analysisResult.analysis_id);
      // Execute the fetchExplanation service helper, passing the analysis ID instead of re-uploading the file
      const result = await fetchExplanation(analysisResult.analysis_id, token);
      console.log("✅ Explanation complete:", result);
      // Save full deep analysis details object
      setExplanationResult(result);
    } catch (err) {
      // Log exceptions
      console.error("❌ Explanation error:", err);
      setError(err.message || "Failed to generate explanation");
    } finally {
      // Turn off explanation loading status
      setIsExplaining(false);
    }
  };

  return (
    // Outer page layout wrapper carrying theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-300`}>
      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* --- HEADER --- */}
        {/* Title descriptions block */}
        <div className="flex justify-between items-end mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              Risk Intelligence <span className="text-cyan-600 dark:text-cyan-400">Analysis</span> <ShieldCheck className="text-cyan-655 dark:text-cyan-400" size={32} />
            </h1>
            <p className="text-slate-500 dark:text-gray-500 mt-2 font-medium">
              Run neural diagnostics on your agreements to uncover hidden liabilities.
            </p>
          </motion.div>
        </div>

        {/* --- INPUT AREA --- */}
        {/* File dropzone and text inputs card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl mb-12"
        >
          <form onSubmit={handleAnalyze} className="space-y-8">
            {/* Grid row mapping file upload on left and manual paste on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left dropzone input field */}
              <label className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] bg-slate-50 dark:bg-slate-950/40 transition-all cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <div className="bg-white dark:bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform">
                  <Upload className="text-cyan-600 dark:text-cyan-400" size={28} />
                </div>
                {/* Display selected filename status */}
                <h3 className="text-lg font-bold mb-2">
                  {file ? `✓ ${file.name}` : "Drop Agreement"}
                </h3>
                <p className="text-slate-500 dark:text-gray-500 text-sm max-w-[200px] mx-auto leading-relaxed">
                  {file ? "Click to change file" : "Securely upload PDF for deep analysis"}
                </p>
              </label>

              {/* Right manual text paste container */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 flex items-center gap-2">
                  <FileText size={14} /> Neural Text Input (Optional)
                </label>
                <textarea
                  rows="8"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste specific clauses or the full text here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-700 text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Error Message display block */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2"
              >
                <AlertTriangle size={18} />
                {error}
              </motion.div>
            )}

            {/* Perform deep scan submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isAnalyzing || !file}
                className="group relative px-10 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Analyzing...
                    </>
                  ) : (
                    <>
                      Perform Deep Scan <Zap size={20} fill="currentColor" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* --- ANALYSIS RESULTS --- */}
        {/* Render results blocks if analysis has completed successfully */}
        <AnimatePresence>
          {analysisComplete && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Overview grid displaying type, confidence, and timestamp metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RiskCard 
                  icon={ShieldCheck} 
                  title="Detected Type" 
                  count={analysisResult.predicted_class || "N/A"} 
                  color="text-cyan-500" 
                  bg="bg-cyan-500/10" 
                  desc="Primary contract classification"
                />
                <RiskCard 
                  icon={CheckCircle} 
                  title="Confidence Score" 
                  count={`${Math.round(analysisResult.confidence || 0)}%`} 
                  color="text-green-500" 
                  bg="bg-green-500/10" 
                  desc="AI classification confidence"
                />
                <RiskCard 
                  icon={FileText} 
                  title="Analysis Date" 
                  count={new Date(analysisResult.analysis_date).toLocaleDateString() || "N/A"} 
                  color="text-blue-500" 
                  bg="bg-blue-500/10" 
                  desc="When this was analyzed"
                />
              </div>

              {/* Alternative prediction percentages listings */}
              {analysisResult.top_predictions && analysisResult.top_predictions.length > 0 && (
                <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    Classification Options <ArrowRight className="text-cyan-600 dark:text-cyan-400" />
                  </h2>
                  
                  <div className="space-y-4">
                    {analysisResult.top_predictions.map((pred, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-slate-800 dark:text-gray-200">{pred.class}</h4>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-600 dark:text-cyan-400`}>
                            {pred.confidence}%
                          </span>
                        </div>
                        {/* Probability loader bar gauge */}
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full"
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parsed contract text excerpt block */}
              {analysisResult.text_preview && (
                <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl">
                  <h2 className="text-xl font-bold mb-6">Document Preview</h2>
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-64 overflow-y-auto">
                    <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{analysisResult.text_preview}</p>
                  </div>
                </div>
              )}

              {/* Trigger button for deep LLM explanations */}
              {!explanationResult && (
                <div className="flex justify-center py-8">
                  <button
                    onClick={handleExplain}
                    disabled={isExplaining || !file}
                    className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-purple-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isExplaining ? (
                        <>
                          <Loader2 className="animate-spin" size={20} /> Generating Explanation...
                        </>
                      ) : (
                        <>
                          <Lightbulb size={20} fill="currentColor" /> Explain & Deep Dive
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}

              {/* Detailed explanation results container panels */}
              {explanationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Analysis details header grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2rem] p-6">
                      <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">Analysis ID</h3>
                      <p className="text-2xl font-black text-cyan-400">{explanationResult.analysis_id || "N/A"}</p>
                    </div>
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2rem] p-6">
                      <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">Predicted Class</h3>
                      <p className="text-2xl font-black text-blue-400">{explanationResult.predicted_class || "N/A"}</p>
                    </div>
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2rem] p-6">
                      <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">Confidence</h3>
                      <p className="text-2xl font-black text-green-400">{explanationResult.confidence ? `${explanationResult.confidence.toFixed(2)}%` : "N/A"}</p>
                    </div>
                  </div>

                  {/* Filename details */}
                  {explanationResult.filename && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8">
                      <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3">Filename</h3>
                      <p className="text-white break-words">{explanationResult.filename}</p>
                    </div>
                  )}

                  {/* Predictions arrays listing */}
                  {explanationResult.predictions && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Zap className="text-yellow-400" size={28} /> Model Predictions
                      </h2>
                      <div className="space-y-4">
                        {Array.isArray(explanationResult.predictions) ? (
                          explanationResult.predictions.map((pred, idx) => (
                            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-gray-300">
                              • {pred}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-gray-300">
                            {String(explanationResult.predictions)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LLM Explanation Analysis Text details */}
                  {explanationResult.llm_explanation && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <BookOpen className="text-cyan-400" size={28} /> AI Deep Analysis
                      </h2>
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 max-h-[600px] overflow-y-auto">
                        <div className="text-gray-300 leading-relaxed text-sm space-y-4">
                          {/* Split explanation lines and render dynamic structures based on formatting styles */}
                          {explanationResult.llm_explanation.split('\n').filter(line => line.trim()).map((line, idx) => {
                            const trimmed = line.trim();
                            // Section sub-headers
                            if (/^\d+\./.test(trimmed)) {
                              return (
                                <div key={idx} className="mt-6 pt-4 border-t border-slate-700">
                                  <h3 className="text-lg font-bold text-cyan-300 mb-3">{trimmed}</h3>
                                </div>
                              );
                            }
                            // Bold clause pointers
                            if (trimmed.includes('–') || trimmed.includes(':')) {
                              return (
                                <p key={idx} className="text-cyan-200 font-semibold">
                                  {trimmed}
                                </p>
                              );
                            }
                            // Normal description text paragraph
                            return (
                              <p key={idx} className="text-gray-400">
                                {trimmed}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backup/Alternative explanations logs */}
                  {explanationResult.explanation && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <BookOpen className="text-purple-400" size={28} /> Detailed Explanation
                      </h2>
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 max-h-96 overflow-y-auto">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                          {String(explanationResult.explanation)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Extracted raw file contents log */}
                  {explanationResult.file_content && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <FileText className="text-blue-400" size={28} /> Contract Content
                      </h2>
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 max-h-96 overflow-y-auto">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                          {String(explanationResult.file_content)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Computed Risk Score assessment details */}
                  {explanationResult.risk_score && (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <AlertTriangle className="text-red-400" size={28} /> Risk Assessment
                      </h2>
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                        <p className="text-gray-300 leading-relaxed">{String(explanationResult.risk_score)}</p>
                      </div>
                    </div>
                  )}

                  {/* Raw payload JSON outputs for debugging */}
                  <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8">
                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">Full Response</h3>
                    <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 max-h-64 overflow-y-auto">
                      <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
                        {JSON.stringify(explanationResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Reusable RiskCard sub-component displaying metric overview summaries
const RiskCard = ({ icon: Icon, title, count, color, bg, desc }) => (
  <div className={`p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 backdrop-blur-sm shadow-xl`}>
    <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mb-6`}>
      <Icon size={24} />
    </div>
    <div className="flex justify-between items-start gap-2 mb-4">
      <h3 className="text-slate-400 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">{title}</h3>
    </div>
    <p className={`text-2xl font-black ${color} mb-2`}>{count}</p>
    <p className="text-xs text-slate-550 dark:text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

// Reusable FindingItem sub-component for detailing individual risk flags
const FindingItem = ({ severity, title, clause, desc, fix }) => (
  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm">
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {severity} Risk
        </span>
        <h4 className="font-bold text-slate-800 dark:text-gray-200">{title}</h4>
      </div>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter">Location: {clause}</span>
    </div>
    <p className="text-sm text-slate-600 dark:text-gray-500 mb-4 leading-relaxed">{desc}</p>
    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-3">
      <Zap size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
      <p className="text-xs text-cyan-700 dark:text-cyan-200/70 italic font-medium">AI Recommendation: {fix}</p>
    </div>
  </div>
);