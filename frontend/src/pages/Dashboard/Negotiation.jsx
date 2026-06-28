// Import React and hooks for state variables, refs, and effects
import React, { useState, useRef, useEffect } from "react";
// Import useNavigate to navigate between dashboard pages programmatically
import { useNavigate } from "react-router-dom";
// Import motion animation wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react library
import { Bot, Send, FileText, MessageSquareText, ChevronDown, Check, RefreshCw, AlertCircle } from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";
// Import markdown renderer helper
import MarkdownRenderer from "../../components/MarkdownRenderer";

// Export default Negotiation page functional component
export default function Negotiation() {
  // Instantiate navigation hook
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();
  // State tracking user message textbox input
  const [input, setInput] = useState("");
  // State tracking loading status during API query execution
  const [loading, setLoading] = useState(false);
  // State carrying conversation history message bubbles (roles: user/assistant)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I’m ACINA, your AI Contract Assistant. You can select a contract from your vault using the dropdown on the left, and ask me to review, redline, or clarify any clauses."
    }
  ]);

  // State carrying a listing of all analyzed contracts
  const [history, setHistory] = useState([]);
  // State tracking the currently selected contract record ID
  const [selectedAnalysisId, setSelectedAnalysisId] = useState("");
  // State carrying full details of the loaded contract object
  const [selectedContract, setSelectedContract] = useState(null);
  // State tracking contract details loading status
  const [fetchingContract, setFetchingContract] = useState(false);

  // Ref hook to keep chat view scrolled to the bottom on new messages
  const scrollRef = useRef(null);

  // Side-effect mapping to fetch contract options when the component mounts
  useEffect(() => {
    fetchHistory();
  }, []); // Run once on initial render

  // Helper method to fetch analyzed contracts from the database
  const fetchHistory = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/contracts/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Clear token and redirect to login page if unauthorized (expired token)
      if (res.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  // Helper method to load contract details and its chat history when dropdown selection updates
  const handleContractChange = async (analysisId) => {
    setSelectedAnalysisId(analysisId);
    // Reset selected contract state and load default greeting if option is empty
    if (!analysisId) {
      setSelectedContract(null);
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! 👋 I’m ACINA, your AI Contract Assistant. You can select a contract from your vault using the dropdown on the left, and ask me to review, redline, or clarify any clauses."
        }
      ]);
      return;
    }
    setFetchingContract(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://localhost:8000/contracts/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Clear token and redirect to login page if unauthorized (expired token)
      if (res.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSelectedContract(data);
        // Load the chat history if it is stored in the database, otherwise set default welcome message
        if (data.chat_history && data.chat_history.length > 0) {
          setMessages(data.chat_history);
        } else {
          setMessages([
            {
              role: "assistant",
              content: `Hello! 👋 I've loaded "${data.filename}". You can ask me to explain clauses, identify risks, or negotiate terms in this document.`
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch contract details:", err);
    } finally {
      setFetchingContract(false);
    }
  };

  // Side-effect triggering scroll alignment when messages array updates
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for dispatching chat inquiries to LLM endpoint
  const handleSend = async (e) => {
    e.preventDefault();
    // Block action if message is empty or request is pending
    if (!input.trim() || loading) return;

    setLoading(true);
    const userMessage = input.trim();
    // Add user message to dialogue
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    // Add typing indicator placeholder bubble
    setMessages((prev) => [...prev, { role: "assistant", content: "ACINA is analyzing..." }]);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Perform POST query to backend chat API passing the clean user query and analysis_id
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          analysis_id: selectedContract ? selectedContract.id : null,
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      
      // Clear token and redirect to login page if unauthorized (expired token)
      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }
      
      // Parse JSON response body
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        throw new Error(data.detail || data.error || `HTTP Error: ${response.status}`);
      }

      // Handle custom failure status fields
      if (data.success === false) {
        throw new Error(data.error || "Unknown error from server");
      }

      // Update messages list by replacing typing placeholder with the LLM response text
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // remove typing indicator
        return [...updated, { role: "assistant", content: data.response || "No response received" }];
      });
    } catch (error) {
      // Log exception stack
      console.error("Full error:", error);
      // Replace typing placeholder with error message
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            role: "assistant",
            content: `⚠️ Error: ${error.message}`
          }
        ];
      });
    }

    // Reset textbox input
    setInput("");
    // Turn off loading status
    setLoading(false);
  };

  return (
    // Outer page layout wrapper carrying theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-300`}>
      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header navigation bar */}
        <header className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-black flex items-center gap-3">
            <MessageSquareText className="text-cyan-600 dark:text-cyan-400" /> Negotiation <span className="text-cyan-600 dark:text-cyan-400">Intelligence</span>
          </h1>
        </header>

        {/* Split view: Left section previewing loaded contract, right section displaying chat */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Split: Document Preview */}
          <section className="flex-1 p-8 overflow-y-auto bg-slate-100 dark:bg-[#050a18] transition-colors">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Dropdown Selector card */}
              <div className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Contract Context</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-500">Load an agreement from your library to enable contract-aware AI answers.</p>
                </div>
                <div className="relative w-full md:w-64">
                  {/* Dropdown element trigger */}
                  <select
                    value={selectedAnalysisId}
                    onChange={(e) => handleContractChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 pr-10 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
                  >
                    <option value="">-- No Active Contract --</option>
                    {/* Render dropdown contract selections */}
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>{h.filename}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Document Preview Viewport Window */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-12 shadow-xl dark:shadow-2xl min-h-[600px] flex flex-col justify-start"
              >
                {/* Check loading status */}
                {fetchingContract ? (
                  // Spinning progress indicator
                  <div className="flex-grow flex flex-col justify-center items-center gap-3">
                    <RefreshCw className="animate-spin text-cyan-600 dark:text-cyan-400" size={32} />
                    <p className="text-xs font-bold text-slate-400">Loading document details...</p>
                  </div>
                ) : selectedContract ? (
                  // Render active contract excerpt details
                  <div className="space-y-6 text-sm">
                    {/* Metadata header row */}
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest block mb-1">Active File</span>
                        <h2 className="text-slate-800 dark:text-white font-black text-xl">{selectedContract.filename}</h2>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
                        {selectedContract.predicted_class}
                      </span>
                    </div>
                    {/* Text Preview block */}
                    <div className="space-y-4 leading-relaxed text-slate-700 dark:text-gray-300">
                      <p className="font-bold text-xs uppercase text-slate-400 dark:text-gray-500 tracking-wider">Document Preview Segment:</p>
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs max-h-96 overflow-y-auto leading-loose whitespace-pre-wrap">
                        {selectedContract.text_preview}
                      </div>
                      {/* Classification confidence check */}
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 p-4 rounded-xl font-bold">
                        <Check size={16} /> Verified classification confidence: {selectedContract.confidence.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  // Render empty status placeholder if no contract is loaded
                  <div className="flex-grow flex flex-col justify-center items-center text-center opacity-30 text-slate-400 p-8">
                    <FileText size={64} className="mb-4" />
                    <h3 className="font-black text-sm uppercase tracking-widest">No Contract Context</h3>
                    <p className="text-xs mt-2 max-w-xs leading-relaxed">Select an agreement from the selector dropdown to review redlines and discuss terms.</p>
                  </div>
                )}
              </motion.div>

            </div>
          </section>

          {/* Right Split: AI Chat Interface */}
          <section className="w-[420px] flex flex-col bg-white dark:bg-slate-950/40 border-l border-slate-200 dark:border-slate-800">
            {/* Scrollable messages history viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  // Slide-in bubble animation wrapper
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Message bubble colored differently based on sender role */}
                    <div
                      className={`max-w-[90%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-white dark:text-slate-950 font-bold rounded-tr-none shadow-md shadow-cyan-500/10 whitespace-pre-wrap"
                          : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-gray-300 rounded-tl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </motion.div>
                ))}
                {/* Invisible element target to scroll to bottom */}
                <div ref={scrollRef}></div>
              </AnimatePresence>
            </div>

            {/* Input textbox and send action button */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <form onSubmit={handleSend} className="relative flex items-center">
                <textarea
                  rows="2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  // Dynamic placeholder string based on contract context
                  placeholder={selectedContract ? "Ask questions about this contract..." : "Ask ACINA to review or redline terms..."}
                  disabled={loading}
                  className="w-full pr-14 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white resize-none"
                />
                {/* Submit trigger button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-3 bottom-3 p-2.5 bg-cyan-500 text-white dark:text-slate-950 rounded-xl hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
