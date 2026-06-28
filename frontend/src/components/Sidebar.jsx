// Import React and hooks for tracking context state, effects, and page routes
import React, { useState, useEffect } from "react";
// Import NavLink for active menu state routing, useNavigate to trigger redirect pathing
import { NavLink, useNavigate } from "react-router-dom";
// Import motion from framer-motion to slide indicator badges smoothly
import { motion } from "framer-motion";
// Import jwt-decode library to read authentication payload variables directly
import { jwtDecode } from "jwt-decode";
// Import vector icons from lucide-react to render sidebar options
import {
  LayoutDashboard,
  FileEdit,
  MessageSquareText,
  Library,
  ShieldAlert,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  User
} from "lucide-react";
// Import custom theme state hook helper
import { useTheme } from "../context/ThemeContext";

// Export default Sidebar functional component
export default function Sidebar() {
  // Navigation hook
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();
  // State variables carrying decoded user details
  const [user, setUser] = useState({ name: "User", email: "" });

  // Side-effect mapping to read local session details when sidebar mounts
  useEffect(() => {
    // Check if session token exists
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Decode token payload
        const decoded = jwtDecode(token);
        // Set user state parameter variables
        setUser({
          name: decoded.name || "User",
          email: decoded.email || ""
        });
      } catch (error) {
        // Log details if decoding fails
        console.error("Invalid token");
      }
    }
  }, []); // Run only on initial mount

  // Sidebar navigation options list
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    // External path targeting Gradio frontend draft tools
    { name: "Generate", icon: FileEdit, path: "https://4f9555ef7a3ae411ab.gradio.live" },
    { name: "Negotiator", icon: MessageSquareText, path: "/negotiator" },
    { name: "Library", icon: Library, path: "/library" },
    { name: "Risk Analysis", icon: ShieldAlert, path: "/risk" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  // Helper method to delete session credentials and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Helper method to extract letter initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    // Sidebar layout container with dynamic dark theme state toggle classes
    <aside className={`w-64 h-screen fixed top-0 left-0 z-50 ${theme === 'dark' ? 'dark' : ''} bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-slate-800 flex flex-col font-sans transition-colors duration-300`}>
      
      {/* --- BRAND SECTION --- */}
      <div className="p-8">
        {/* Brand logo container mapping to home redirection */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-transform">
            <Zap size={22} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">ACINA</span>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      {/* Vertical list navigation menu options */}
      <nav className="flex-grow px-4 space-y-1">
        {menu.map((item, i) => {
          // Identify external links (Gradio) vs internal routes
          const isExternal = item.path.startsWith("http");
          
          // Render HTML anchor tag for Gradio tools
          if (isExternal) {
            return (
              <a
                key={i}
                href={item.path}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    size={20} 
                    className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors" 
                  />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </div>
              </a>
            );
          }
          
          // Render NavLink tag for internal react routes
          return (
            <NavLink
              key={i}
              to={item.path}
              // Dynamically style based on isActive status passed by NavLink
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] border border-cyan-500/10"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left grouped icon and label name elements */}
                  <div className="flex items-center gap-3">
                    <item.icon 
                      size={20} 
                      className={isActive ? "text-cyan-600 dark:text-cyan-400" : "group-hover:text-slate-900 dark:group-hover:text-white transition-colors"} 
                    />
                    <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                  </div>
                  {/* Chevron sliding entry indicator badge for active item */}
                  {isActive && (
                    <motion.div layoutId="sidebar-indicator">
                      <ChevronRight size={14} className="text-cyan-600 dark:text-cyan-400" />
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* --- LOGGED IN USER SECTION --- */}
      {/* Bottom footer elements rendering session identity profile metadata */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        {/* Profile Card wrapper block */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 mb-4 border border-slate-200 dark:border-slate-800 group hover:border-cyan-500/30 transition-all cursor-default">
           {/* Avatar bubble showing username initials or generic User icon */}
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-400/20 text-xs">
              {user.name ? getInitials(user.name) : <User size={16}/>}
           </div>
           {/* Vertical text layout containing session details */}
           <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.email}</span>
           </div>
        </div>

        {/* Logout session action button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wide">Log Out</span>
        </button>
      </div>

      {/* Version subtitle string footer text */}
      <div className="px-8 pb-6 text-[10px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-widest">
        Intelligence v2.1
      </div>
    </aside>
  );
}