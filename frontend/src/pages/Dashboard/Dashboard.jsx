// Import React and hooks for managing dashboard data states and effects
import React, { useState, useEffect } from "react";
// Import motion and presence wrappers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import useNavigate to navigate between dashboard pages programmatically
import { useNavigate } from "react-router-dom";
// Import jwtDecode to read identity variables from auth tokens
import { jwtDecode } from "jwt-decode";
// Import required vector icons from lucide-react library
import { 
  Upload, 
  FilePlus, 
  Bot, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  FileSearch, 
  ArrowUpRight, 
  Zap,
  Activity,
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles
} from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

/**
 * Helper function to format ISO strings as human readable time differences
 * @param {string} dateString - The ISO date string
 * @returns {string} Human readable elapsed time
 */
const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// Reusable Stat Card sub-component for rendering KPI metrics
const StatCard = ({ title, value, change, icon: Icon, color, showBar = false, barPercent = 0, loading = false }) => (
  // Animated container using motion.div
  <motion.div 
    whileHover={{ y: -6, scale: 1.01 }}
    transition={{ duration: 0.2 }}
    className="relative overflow-hidden bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-xl shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-slate-300 dark:hover:border-slate-700/60 transition-colors"
  >
    {/* Backdrop visual gradient mask */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/[0.01] dark:from-white/[0.02] to-transparent pointer-events-none" />
    
    {/* Check loading status */}
    {loading ? (
      // Loading pulse placeholder
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    ) : (
      // Render statistic properties
      <>
        {/* Header row containing icon and monthly percentage difference indicators */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-current/10 text-opacity-100`}>
            <Icon size={22} className={color.replace('bg-', 'text-')} />
          </div>
          <span className="flex items-center text-[10px] font-black tracking-wider text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full uppercase">
            <TrendingUp size={10} className="mr-1" /> {change}
          </span>
        </div>
        
        {/* Metric Label */}
        <h3 className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest relative z-10">{title}</h3>
        {/* Metric Value */}
        <p className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white relative z-10">{value}</p>

        {/* If progress bar flag is active, render horizontal progress gauge bar */}
        {showBar && (
          <div className="mt-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden relative z-10 border border-slate-200/50 dark:border-white/5">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
              style={{ width: `${barPercent}%` }}
            />
          </div>
        )}
      </>
    )}
  </motion.div>
);

// Export default Dashboard functional page component
export default function Dashboard() {
  // Navigation hook
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();
  // State variable carrying user's first name
  const [userName, setUserName] = useState("User");
  // State variable carrying overall library KPIs counts
  const [stats, setStats] = useState({
    total_analyses: 0,
    active_risks: 0,
    average_confidence: 0,
    most_common_type: "N/A"
  });
  // State variable carrying recent contracts history lists
  const [history, setHistory] = useState([]);
  // State tracking API request loading statuses
  const [loading, setLoading] = useState(true);
  // State tracking server or connection offline error warning alerts
  const [error, setError] = useState("");

  // Helper method to fetch all dashboard statistical metrics and history list
  const fetchDashboardData = async () => {
    // Clear old errors
    setError("");
    const token = localStorage.getItem("access_token");
    // Redirection check if session credentials are missing
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode identity variables from token
      const decoded = jwtDecode(token);
      setUserName(decoded.name ? decoded.name.split(" ")[0] : "User");

      // Set authorization headers
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Query database statistics and history history in parallel
      const [statsRes, historyRes] = await Promise.all([
        fetch("http://localhost:8000/contracts/stats/summary", { headers }),
        fetch("http://localhost:8000/contracts/history", { headers })
      ]);

      // Clear token and redirect to login page if unauthorized (expired token)
      if (statsRes.status === 401 || historyRes.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      // Block flow on server connection errors
      if (!statsRes.ok || !historyRes.ok) {
        throw new Error("Unable to fetch backend data");
      }

      // Parse JSON response bodies
      const statsData = await statsRes.json();
      const historyData = await historyRes.json();

      // Compute active risk files count (confidence scores below 60% indicates potential risk items)
      const calculatedActiveRisks = historyData.filter(item => item.confidence < 60).length;

      // Save statistical counts
      setStats({
        total_analyses: statsData.total_analyses || 0,
        active_risks: calculatedActiveRisks,
        average_confidence: statsData.average_confidence || 0,
        most_common_type: statsData.most_common_type || "N/A"
      });

      // Save recent history data list
      setHistory(historyData);
    } catch (err) {
      // Fall back to offline simulation on connection failures
      console.error("Dashboard connection error:", err);
      setError("Unable to connect to live API server. Displaying offline simulation.");
      
      // Simulated mock files listing
      const simulatedHistory = [
        { id: "mock-1", filename: "Global Partners SLA.pdf", predicted_class: "Strategic Alliance", confidence: 45.5, analysis_date: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
        { id: "mock-2", filename: "Cloud Services MSA.pdf", predicted_class: "Collaboration", confidence: 92.3, analysis_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { id: "mock-3", filename: "Internal NDA v2.pdf", predicted_class: "NDA", confidence: 78.1, analysis_date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
        { id: "mock-4", filename: "Vendor Logistics SOW.pdf", predicted_class: "Strategic Alliance", confidence: 48.0, analysis_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
      ];

      // Set simulated KPIs counts
      setStats({
        total_analyses: simulatedHistory.length,
        active_risks: 2,
        average_confidence: 65.98,
        most_common_type: "Strategic Alliance"
      });
      // Save simulated list
      setHistory(simulatedHistory);
    } finally {
      // Reset loading statuses
      setLoading(false);
    }
  };

  // Side-effect mapping to fetch dashboard statistics when navigate changes
  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  return (
    // Outer page layout wrapper carrying theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300`}>
      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 p-8 md:p-12 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col justify-between">
        
        <div>
          {/* --- HEADER PANEL --- */}
          {/* Dynamic header welcome greeting and connection status */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative">
            {/* Left section: welcome text greeting */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
                Welcome back, <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">{userName}</span>
              </h1>
              {/* Contextual description details depending on active risk counts */}
              <p className="text-slate-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-600 dark:text-cyan-400" />
                {stats.active_risks > 0 
                  ? `You have ${stats.active_risks} contracts flagged with active risk items.` 
                  : "All monitored contracts are within safe parameters."}
              </p>
            </motion.div>
            
            {/* Right section: live/offline connection node display wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 px-6 py-4 rounded-3xl backdrop-blur-md shadow-sm dark:shadow-md"
            >
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Network Node</p>
                <p className={`text-xs font-bold flex items-center gap-2 mt-1 ${error ? 'text-yellow-600 dark:text-yellow-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-yellow-500' : 'bg-cyan-500'}`} />
                  {error ? 'Running offline' : 'AI Database Connected'}
                </p>
              </div>
              {/* Refresh dashboard triggers */}
              <button 
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 text-slate-600 dark:text-white"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </motion.div>
          </div>

          {/* Connection Error Warning Banner popup */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-600 dark:text-yellow-400 text-xs font-semibold flex items-center gap-3"
            >
              <AlertTriangle size={18} />
              {error}
            </motion.div>
          )}

          {/* --- KPI STATS GRID --- */}
          {/* Row grid mapping KPI counts using StatCard sub-component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              title="Total Scans" 
              value={stats.total_analyses} 
              change="+10%" 
              icon={FileSearch} 
              color="bg-cyan-500" 
              loading={loading}
            />
            <StatCard 
              title="Active Risks" 
              value={stats.active_risks} 
              change={stats.active_risks > 0 ? "+5%" : "0%"} 
              icon={ShieldAlert} 
              color="bg-red-500" 
              loading={loading}
            />
            <StatCard 
              title="AI Generations" 
              value={stats.total_analyses * 2} 
              change="+18%" 
              icon={Zap} 
              color="bg-indigo-500" 
              loading={loading}
            />
            <StatCard 
              title="Avg. Confidence" 
              value={`${stats.average_confidence.toFixed(1)}%`} 
              change="+4.2%" 
              icon={CheckCircle} 
              color="bg-green-500" 
              showBar={true}
              barPercent={stats.average_confidence}
              loading={loading}
            />
          </div>

          {/* --- QUICK ACTIONS BENTO --- */}
          {/* Bento grid mapping dashboard quick access panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             {[
               { 
                 title: "Smart Upload", 
                 icon: Upload, 
                 desc: "Drag & drop PDF for instant AI risk scoring.", 
                 path: "/risk" 
               },
               { 
                 title: "Drafting Suite", 
                 icon: FilePlus, 
                 desc: "Generate MSA/NDA from firm playbooks.", 
                 path: "https://4f9555ef7a3ae411ab.gradio.live"
               },
               { 
                 title: "Negotiator", 
                 icon: Bot, 
                 desc: "Compare redlines with AI-suggested clauses.", 
                 path: "/negotiator" 
               }
             ].map((action, i) => {
               // Identify external Gradio links vs internal react pages paths
               const isExternal = action.path.startsWith("http");
               const handleClick = () => {
                 if (isExternal) {
                   window.location.href = action.path;
                 } else {
                   navigate(action.path);
                 }
               };
               return (
               // Individual Bento card wrapper
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.02, y: -4 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleClick}
                 className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-xl"
               >
                 {/* Sliding hover link arrow icon */}
                 <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 text-cyan-600 dark:text-cyan-400 transition-all duration-300">
                   <ArrowUpRight size={24} />
                 </div>
                 {/* Action Icon */}
                 <action.icon size={28} className="text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                 {/* Action Title */}
                 <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">{action.title}</h3>
                 {/* Action Description */}
                 <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{action.desc}</p>
               </motion.div>
               );
             })}
          </div>

          {/* --- DATA TABLE & TIMELINE PIPELINE --- */}
          {/* Split grid mapping recent contracts tables left, recent events updates timeline right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Left section: Priority Pipeline Contract log list */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-sm dark:shadow-2xl text-slate-900 dark:text-white">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Database size={18} className="text-cyan-600 dark:text-cyan-400" /> Priority Pipeline
                </h2>
                {/* Vault library redirection link */}
                <button 
                  onClick={() => navigate('/library')} 
                  className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hover:text-cyan-500 hover:underline flex items-center gap-1"
                >
                  View Library <ChevronRight size={12} />
                </button>
              </div>
              
              {/* Responsive table mapping contracts */}
              <div className="overflow-x-auto">
                {loading ? (
                  // Pulse placeholder loaders
                  <div className="space-y-4 py-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex justify-between items-center animate-pulse py-4 border-b border-slate-100 dark:border-slate-900">
                        <div className="w-1/3 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  // Empty contracts pipeline placeholder
                  <div className="text-center py-12 text-slate-400">
                    <FileSearch className="mx-auto mb-4 opacity-30" size={48} />
                    <p className="font-bold">No active agreements found</p>
                    <p className="text-xs mt-1">Upload a PDF contract to initialize scans</p>
                  </div>
                ) : (
                  // Main log table listing properties
                  <table className="w-full">
                    <thead>
                      <tr className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">
                        <th className="pb-4 text-left font-black">Agreement Name</th>
                        <th className="pb-4 text-left font-black">Risk Level</th>
                        <th className="pb-4 text-left font-black">Status</th>
                        <th className="pb-4 text-right font-black">Redlines</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {/* Map slice containing the first 5 records */}
                      {history.slice(0, 5).map((item, i) => {
                        let riskLabel = "Low";
                        let riskColor = "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
                        // Assign risk label strings based on confidence metrics
                        if (item.confidence < 60) {
                          riskLabel = "High";
                          riskColor = "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
                        } else if (item.confidence < 80) {
                          riskLabel = "Medium";
                          riskColor = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20";
                        }

                        return (
                          <tr key={item.id || i} className="group border-b border-slate-100 dark:border-slate-900/60 hover:bg-slate-500/[0.02] dark:hover:bg-white/[0.01] transition-colors">
                            {/* Contract Name */}
                            <td className="py-5 font-bold text-slate-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors max-w-[200px] truncate" title={item.filename}>
                              {item.filename}
                            </td>
                            {/* Computed risk badge */}
                            <td className="py-5">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${riskColor}`}>
                                {riskLabel}
                              </span>
                            </td>
                            {/* predicted classification */}
                            <td className="py-5 text-slate-500 dark:text-gray-400 font-medium">
                              {item.predicted_class || "Classification Pending"}
                            </td>
                            {/* Actions redirecting to negotiator */}
                            <td className="py-5 text-right">
                              <button 
                                onClick={() => navigate('/negotiator')} 
                                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
                              >
                                <ArrowUpRight size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right section: Live Updates events timeline */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-sm dark:shadow-2xl text-slate-900 dark:text-white">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Activity size={18} className="text-cyan-600 dark:text-cyan-400" /> Live Updates
              </h2>
              
              {/* Check loading status */}
              {loading ? (
                // Pulse loader
                <div className="space-y-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex gap-4 animate-pulse">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                // Empty logs placeholder
                <div className="text-center py-12 text-slate-400">
                  <Clock className="mx-auto mb-4 opacity-30" size={36} />
                  <p className="font-bold text-sm">No recent logs</p>
                </div>
              ) : (
                // Vertical updates timeline
                <div className="space-y-8 relative">
                  {/* Dashed timeline spine line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 ml-[-1px] border-dashed" />
                  {/* Map slice of the first 4 events */}
                  {history.slice(0, 4).map((act, i) => {
                    const isHigh = act.confidence < 60;
                    // Format node colors depending on risk state
                    const iconColor = isHigh 
                      ? "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-900/30 border border-red-500/20" 
                      : "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-900/30 border border-green-500/20";
                    const NodeIcon = isHigh ? AlertTriangle : CheckCircle;

                    return (
                      <div key={act.id || i} className="relative flex gap-6 pl-2 group">
                        {/* Status Node Ring icon bubble */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-105 duration-200 ${iconColor}`}>
                          <NodeIcon size={14} />
                        </div>
                        {/* Event details text content */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">
                            {isHigh ? "Risk Alert Detected" : "Classification Synced"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-[200px] truncate" title={act.filename}>
                            {act.filename} ({act.predicted_class})
                          </p>
                          {/* Elapsed relative timestamp */}
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-2 block">
                            {formatTimeAgo(act.analysis_date)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}