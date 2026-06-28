// Import React and hooks for managing theme settings state, effects, and creations
import React, { useEffect, useState } from "react";
// Import motion animation wrappers and presence handlers from framer-motion library
import { motion, AnimatePresence } from "framer-motion";
// Import useNavigate navigation hook from react-router-dom
import { useNavigate } from "react-router-dom";
// Import required vector icons from lucide-react library
import { 
  User, Lock, Palette, LogOut, ShieldCheck, Mail, 
  CheckCircle2, AlertCircle, Moon, Sun 
} from "lucide-react";
// Import left-aligned dashboard sidebar navigation panel
import Sidebar from "../../components/Sidebar";
// Import custom theme state hook helper
import { useTheme } from "../../context/ThemeContext";

// Export default Settings page functional component
export default function Settings() {
  // Navigation hook
  const navigate = useNavigate();
  // Retrieve token from browser localStorage
  const token = localStorage.getItem("access_token");
  // Retrieve current active theme variables and toggle actions
  const { theme, toggleTheme } = useTheme();

  // State carrying the full user context payload
  const [user, setUser] = useState(null);
  // State carrying profile details inputs (name, email)
  const [profile, setProfile] = useState({ name: "", email: "" });
  // State carrying security passwords inputs (old, new)
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  // State tracking success feedback banner text
  const [message, setMessage] = useState("");
  // State tracking error feedback banner text
  const [error, setError] = useState("");
  // State tracking active API save request statuses
  const [isUpdating, setIsUpdating] = useState(false);

  // Side-effect mapping to fetch active user profile information when Settings mounts
  useEffect(() => {
    // If auth token is missing, redirect session immediately to login path
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetch profile attributes using token authorization Bearer header
    fetch("http://localhost:8000/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Set user context states
        setUser(data);
        setProfile({ name: data.name, email: data.email });
      })
      .catch(() => navigate("/login"));
  }, [navigate, token]); // Re-run effect if navigate or token changes

  // Action method to dispatch profile or password changes to the backend
  const handleUpdate = async (type) => {
    // Clear old feedback alerts
    setError("");
    setMessage("");
    // Trigger loading status
    setIsUpdating(true);
    // Determine target endpoint and body payload based on action type
    const endpoint = type === 'profile' ? 'users/profile' : 'users/change-password';
    const body = type === 'profile' ? profile : passwords;

    try {
      // Dispatch PUT request containing authorization token
      const res = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      // Parse JSON response body
      const data = await res.json();
      // Block flow on server errors
      if (!res.ok) throw new Error(data.message || data.detail);
      // Display success message
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
      // Clear password fields on password updates
      if (type === 'password') setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      // Capture and display error string
      setError(err.message || "Operation failed");
    } finally {
      // Reset loading status
      setIsUpdating(false);
    }
  };

  // Block rendering until user details have been retrieved successfully
  if (!user) return null;

  return (
    // Outer page layout wrapper containing theme class bindings
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white font-sans transition-colors duration-300`}>
      {/* Render left-aligned dashboard sidebar */}
      <Sidebar />

      {/* Main content body viewport panel */}
      <main className="ml-64 flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* Header and alerts banner container */}
        <div className="flex justify-between items-start mb-12">
          {/* Animated Header */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black tracking-tight">Account <span className="text-cyan-600 dark:text-cyan-400">Settings</span></h1>
            <p className="text-slate-500 dark:text-gray-500 mt-2 font-medium">Manage your professional profile and security preferences.</p>
          </motion.div>
          
          {/* Dynamic feedback messages popups */}
          <AnimatePresence>
            {(message || error) && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${message ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'}`}
              >
                {/* Select icon indicator based on alert status */}
                {message ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                <span className="text-sm font-bold">{message || error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Multi-column settings grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left larger sections: Profile & security credentials */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Profile Section */}
            <section className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"><User size={20}/></div>
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>
              
              {/* Profile fields grid row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest ml-1">Full Name</label>
                  <input 
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                {/* Email input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest ml-1">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-600" size={16}/>
                    <input 
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 pl-12 rounded-2xl text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              {/* Profile update submit button */}
              <button 
                onClick={() => handleUpdate('profile')}
                disabled={isUpdating}
                className="px-8 py-3 bg-cyan-500 text-white dark:text-slate-950 font-black rounded-xl text-sm hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all disabled:opacity-50"
              >
                Save Profile Changes
              </button>
            </section>

            {/* Password Section */}
            <section className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"><Lock size={20}/></div>
                <h2 className="text-xl font-bold">Security & Authentication</h2>
              </div>
              
              {/* Password fields grid row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Old password field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest ml-1">Current Password</label>
                  <input 
                    type="password"
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={passwords.oldPassword}
                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                  />
                </div>
                {/* New password field */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest ml-1">New Password</label>
                  <input 
                    type="password"
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-sm focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  />
                </div>
              </div>
              {/* Password update submit button */}
              <button 
                onClick={() => handleUpdate('password')}
                disabled={isUpdating}
                className="px-8 py-3 bg-yellow-500 text-white dark:text-slate-950 font-black rounded-xl text-sm hover:bg-yellow-600 dark:hover:bg-yellow-300 transition-all disabled:opacity-50"
              >
                Update Security Credentials
              </button>
            </section>
          </div>

          {/* Right smaller sections: Theme details & Session logouts */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Appearance settings card */}
            <section className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Palette className="text-purple-500 dark:text-purple-400" size={18}/> Appearance
              </h3>
              <div className="space-y-4">
                {/* Light/Dark mode toggler block */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                  <div className="flex items-center gap-2">
                    {/* Select theme icon */}
                    {theme === 'dark' ? <Moon size={16} className="text-slate-400" /> : <Sun size={16} className="text-yellow-500" />}
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">Theme</span>
                  </div>
                  {/* Toggle theme trigger link */}
                  <button 
                    onClick={toggleTheme} 
                    className="text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase hover:underline"
                  >
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>
            </section>

            {/* Session termination Danger Zone card */}
            <section className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8 shadow-xl">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
                <LogOut size={18}/> Danger Zone
              </h3>
              {/* Active account description */}
              <p className="text-xs text-slate-500 dark:text-gray-500 mb-6 leading-relaxed">Logged in as <span className="text-slate-900 dark:text-white font-bold">{user.email}</span>.</p>
              {/* Log out trigger button */}
              <button 
                onClick={() => { localStorage.removeItem("access_token"); navigate("/login"); }}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
              >
                Terminate Session
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}