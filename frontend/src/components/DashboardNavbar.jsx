// Import React base library for rendering elements
import React from "react";
// Import framer-motion library to handle smooth component transitions and entries
import { motion } from "framer-motion";
// Import plus sign icon from react-icons
import { FiPlus } from "react-icons/fi";

// Export default DashboardNavbar functional component
export default function DashboardNavbar() {
  // Parse user session details from browser localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  // Extract user's name or fall back to "User" string
  const username = user?.name || "User";

  return (
    // Render animated navigation bar using motion.div
    <motion.div
      // Set initial entry animations (hidden opacity and shifted slightly up)
      initial={{ opacity: 0, y: -20 }}
      // Animate entry to fully visible and positioned at normal y offset
      animate={{ opacity: 1, y: 0 }}
      // Configure transition duration timing
      transition={{ duration: 0.4 }}
      // Set layout CSS styles (height, margins, flex spacing, background blur, and border styles)
      className="h-20 ml-64 px-10 flex items-center justify-between
                 bg-white/5 backdrop-blur-xl border-b border-white/10
                 text-white"
    >
      {/* Animated Action Button for triggering new contract scans/drafts */}
      <motion.button
        // Apply hover scale-up animation effect
        whileHover={{ scale: 1.05 }}
        // Set layout classes (flex centering, padding, gradients, rounded corners, and shadow styling)
        className="flex items-center gap-2 px-5 py-2 rounded-xl
                   bg-gradient-to-r from-cyan-400 to-blue-500
                   text-slate-900 font-semibold shadow-lg"
      >
        {/* Render plus symbol */}
        <FiPlus />
        {/* Button copy text */}
        New Analysis
      </motion.button>

      {/* User Info Container */}
      <div className="flex items-center gap-4">
        {/* Right aligned text container */}
        <div className="text-right">
          {/* Render active username */}
          <p className="text-sm font-medium">{username}</p>
          {/* Render subtitle dashboard copy */}
          <p className="text-xs text-gray-400">AI Dashboard</p>
        </div>

        {/* User avatar profile image */}
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-10 h-10 rounded-full border border-white/20"
        />
      </div>
    </motion.div>
  );
}
