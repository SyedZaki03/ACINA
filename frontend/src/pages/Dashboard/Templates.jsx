// Import React base library
import React from "react";
// Import motion animation wrappers from framer-motion library
import { motion } from "framer-motion";
// Import required vector icons from lucide-react library
import {
  FileText,
  Briefcase,
  Shield,
  Users
} from "lucide-react";
// Import the common Sidebar component for dashboard navigation
import Sidebar from "../../components/Sidebar";
// Import useNavigate to navigate between dashboard pages programmatically
import { useNavigate } from "react-router-dom";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

// Export default Templates page functional component
export default function Templates() {
  // Navigation hook
  const navigate = useNavigate();
  // Retrieve current active theme variables
  const { theme } = useTheme();

  // Setup list of template categories with custom icons and labels
  const templates = [
    {
      title: "Non-Disclosure Agreement (NDA)",
      icon: <Shield size={26} />,
      desc: "Protect confidential business information",
      type: "NDA"
    },
    {
      title: "Service Agreement",
      icon: <Briefcase size={26} />,
      desc: "Define scope, payment, and obligations",
      type: "Service Agreement"
    },
    {
      title: "Employment Contract",
      icon: <Users size={26} />,
      desc: "Standard employment terms and clauses",
      type: "Employment Contract"
    },
    {
      title: "Vendor Agreement",
      icon: <FileText size={26} />,
      desc: "Formalize vendor relationships",
      type: "Vendor Agreement"
    }
  ];

  return (
    // Outer page layout wrapper carrying theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-300`}>

      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 flex-1 p-8 md:p-12 overflow-y-auto">

        {/* Header Section */}
        {/* Animated header section with entry transition rules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          {/* Header title heading */}
          <h1 className="text-4xl font-black tracking-tight">
            Contract <span className="text-cyan-600 dark:text-cyan-400">Templates</span> 📑
          </h1>
          {/* Subtitle details */}
          <p className="text-slate-500 dark:text-gray-500 mt-2 font-medium">
            Choose a template to quickly generate a contract
          </p>
        </motion.div>

        {/* Templates Cards Grid mapping layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl, i) => (
            // Animated card wrapper carrying hover transitions
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl cursor-default flex flex-col justify-between"
            >
              {/* Category card content details */}
              <div>
                {/* Icon bubble wrapper with colored background */}
                <div className="text-cyan-600 dark:text-cyan-400 mb-6 bg-cyan-500/10 p-3 rounded-2xl w-fit">
                  {tpl.icon}
                </div>

                {/* Template title */}
                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                  {tpl.title}
                </h3>

                {/* Template description copy text */}
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  {tpl.desc}
                </p>
              </div>

              {/* Action trigger button linking to generate path carrying template category states */}
              <button
                onClick={() =>
                  navigate("/generate", {
                    state: { template: tpl.type }
                  })
                }
                className="w-full py-3.5 rounded-2xl bg-cyan-500 text-white dark:text-slate-950 font-black text-sm hover:bg-cyan-600 dark:hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/10"
              >
                Use This Template
              </button>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
