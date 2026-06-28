// Import React and hooks for managing vault list states and effects
import React, { useState, useEffect } from "react";
// Import useNavigate to navigate between dashboard pages programmatically
import { useNavigate } from "react-router-dom";
// Import motion and presence wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import required vector icons from lucide-react library
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  Trash2,
  FileCheck2,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

// Export default ContractLibrary functional page component
export default function ContractLibrary() {
  // Navigation hook instantiation
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();
  // State variable controlling the selection of active categories tab ("All", "Active", etc.)
  const [activeTab, setActiveTab] = useState("All");
  // State variable carrying loaded contract documents lists
  const [contracts, setContracts] = useState([]);
  // State tracking API request loading statuses
  const [loading, setLoading] = useState(true);
  // State carrying server or connection error logs
  const [error, setError] = useState("");
  // State tracking keyword search inputs
  const [searchTerm, setSearchTerm] = useState("");
  // State tracking history pagination offset indices
  const [offset, setOffset] = useState(0);
  // Constant indicating pagination limit sizes
  const [limit] = useState(15);
  
  // State tracking aggregate library counts (low, med, high risk items)
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    signed: 0,
    awaiting: 0,
    highRisk: 0
  });

  // Allowed categories tabs definitions list
  const categories = ["All", "Active", "Review", "Negotiation"];

  // Side-effect mapping to fetch contract data when the tab selection, search keywords, or page offset updates
  useEffect(() => {
    fetchContracts();
  }, [activeTab, searchTerm, offset]); // Re-run if query variables update

  // Helper method to fetch analyzed contracts from the database
  const fetchContracts = async () => {
    // Trigger loading status
    setLoading(true);
    // Clear old errors
    setError("");
    
    try {
      const token = localStorage.getItem("access_token");
      // Enforce session presence validation checks
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      // Configure history query params
      const params = new URLSearchParams();
      params.append("limit", limit);
      params.append("offset", offset);
      
      // Dispatch GET query to history API endpoint
      const response = await fetch(`http://localhost:8000/contracts/history?${params}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
        setError(data.detail || data.error || "Failed to fetch contracts");
        setLoading(false);
        return;
      }

      // Map history details to frontend list format and calculate statuses dynamically based on confidence
      const mappedContracts = (data || []).map((item, idx) => {
        // Map confidence scores to status categories
        let status = "Active";
        if (item.confidence < 60) {
          status = "Negotiation";
        } else if (item.confidence < 80) {
          status = "Review";
        }

        return {
          id: item.id || idx,
          name: item.filename || "Unknown",
          type: item.predicted_class || "Unknown",
          status: status,
          risk: item.confidence ? (item.confidence >= 80 ? "Low" : item.confidence >= 60 ? "Medium" : "High") : "Unknown",
          date: new Date(item.analysis_date).toLocaleDateString(),
          format: "PDF",
          confidence: item.confidence
        };
      });

      // Calculate dynamic stats numbers based on confidence scores
      const total = mappedContracts.length;
      const signed = mappedContracts.filter(c => c.confidence >= 80).length;
      const awaiting = mappedContracts.filter(c => c.confidence >= 60 && c.confidence < 80).length;
      const highRisk = mappedContracts.filter(c => c.confidence < 60).length;

      setSummaryStats({ total, signed, awaiting, highRisk });

      // Apply tab filter matching
      const filtered = mappedContracts.filter(c => {
        if (activeTab === "All") return true;
        return c.status === activeTab;
      });

      // Apply search keyword matching
      const searched = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Save filtered contracts array list
      setContracts(searched);
    } catch (err) {
      // Catch exceptions and log failure
      setError("Failed to connect to server");
      console.error(err);
    } finally {
      // Turn off loading status
      setLoading(false);
    }
  };

  // Action method to request document deletion
  const handleDelete = async (analysisId) => {
    // Prompt confirmation alert
    if (!window.confirm("Are you sure you want to delete this contract from your library?")) return;
    
    const token = localStorage.getItem("access_token");
    try {
      // Dispatch DELETE request to contract API endpoint
      const res = await fetch(`http://localhost:8000/contracts/${analysisId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list if success
      if (res.ok) {
        fetchContracts();
      } else {
        alert("Failed to delete analysis");
      }
    } catch (err) {
      console.error("Delete contract error:", err);
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
        <div className="flex justify-between items-start mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight">
              Contract Vault <span className="text-cyan-600 dark:text-cyan-400">Library</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-500 mt-2 font-medium">
              Centrally manage and audit your organization's legal architecture.
            </p>
          </motion.div>
        </div>

        {/* --- REPOSITORY STATS --- */}
        {/* Row grid listing aggregate count statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Files", val: summaryStats.total, icon: FileText, color: "text-blue-500 bg-blue-500/10" },
            { label: "Fully Signed", val: summaryStats.signed, icon: FileCheck2, color: "text-green-500 bg-green-500/10" },
            { label: "Awaiting Review", val: summaryStats.awaiting, icon: Clock, color: "text-yellow-500 bg-yellow-500/10" },
            { label: "High Risk Flags", val: summaryStats.highRisk, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
          ].map((stat, i) => (
            // Individual stat card
            <div key={i} className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-4 shadow-md">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- SEARCH & ACTIONS BAR --- */}
        {/* Text search keyword inputs */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 group-focus-within:text-cyan-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by contract name, legal party, or specific clause keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOffset(0); // Reset page offset on new searches
              }}
              className="w-full bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* --- TABS --- */}
        {/* Categories toggles tabs */}
        <div className="flex gap-8 mb-6 border-b border-slate-200 dark:border-slate-800 px-2">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setOffset(0);
              }}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
              }`}
            >
              {tab}
              {/* Highlight neon underline bar for active tab */}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
              )}
            </button>
          ))}
        </div>

        {/* --- DATA GRID --- */}
        {/* Main contracts log tables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-2xl"
        >
          {/* Display error banner alerts if any exist */}
          {error && (
            <div className="p-6 bg-red-500/10 border-b border-red-500/20 text-red-500 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Check loading status */}
          {loading ? (
            // Spinner panel
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="animate-spin text-cyan-600 dark:text-cyan-400 mr-3" size={24} />
              <span className="text-slate-500 dark:text-gray-400 font-bold text-xs">Loading contracts...</span>
            </div>
          ) : contracts.length === 0 ? (
            // Empty view alert placeholder
            <div className="p-12 text-center text-slate-400 dark:text-gray-500">
              <FileText size={40} className="mx-auto mb-4 opacity-50 text-cyan-500" />
              <p className="font-bold">No contracts found</p>
            </div>
          ) : (
            // Render matching logs data list
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-200 dark:border-slate-800">
                    <th className="px-8 py-5">Contract Details</th>
                    <th className="px-4 py-5">Type</th>
                    <th className="px-4 py-5">Status</th>
                    <th className="px-4 py-5">Risk</th>
                    <th className="px-4 py-5">Modified</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {/* Loop through matching contracts */}
                  {contracts.map((item) => (
                    <tr key={item.id} className="group hover:bg-cyan-500/[0.02] dark:hover:bg-cyan-500/[0.01] transition-colors">
                      {/* Name details column */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-black text-[10px] shadow-sm">
                            {item.format}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{item.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-gray-600 font-medium">Confidence: {item.confidence.toFixed(1)}%</p>
                          </div>
                        </div>
                      </td>
                      {/* Predicted type column */}
                      <td className="px-4 py-5">
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{item.type}</span>
                      </td>
                      {/* Computed status badge column */}
                      <td className="px-4 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          item.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" :
                          item.status === "Review" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20" :
                          item.status === "Negotiation" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                          "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}>
                          <div className={`w-1 h-1 rounded-full animate-pulse ${
                            item.status === "Active" ? "bg-green-400" :
                            item.status === "Review" ? "bg-yellow-400" : "bg-blue-400"
                          }`} />
                          {item.status}
                        </div>
                      </td>
                      {/* Computed risk badge column */}
                      <td className="px-4 py-5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.risk === "High" ? "text-red-500" :
                          item.risk === "Medium" ? "text-yellow-500" : "text-green-500"
                        }`}>
                          {item.risk}
                        </span>
                      </td>
                      {/* Last modified date column */}
                      <td className="px-4 py-5 text-xs text-slate-500 dark:text-gray-600 font-medium">{item.date}</td>
                      {/* Action buttons (discussion or delete) column */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Directs to negotiator page */}
                          <button onClick={() => navigate('/negotiator')} title="Redline & Discuss" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"><Eye size={16}/></button>
                          {/* Deletes analysis record from database */}
                          <button onClick={() => handleDelete(item.id)} title="Delete" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </main>
    </div>
  );
}