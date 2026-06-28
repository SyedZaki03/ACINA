// Import React core library
import React from "react";
// Import common Navbar header
import Navbar from "../components/Navbar"; 
// Import common Footer elements
import Footer from "../components/Footer";

// Reusable Job Card sub-component for rendering career listings
const JobCard = ({ title, category, location }) => (
  // Card wrapper carrying hover border animations
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-cyan-400 transition-colors group">
    {/* Inner flex layout matching left-aligned text with right-aligned button */}
    <div className="flex justify-between items-center">
      <div>
        {/* Render role name */}
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {/* Render role details metadata */}
        <p className="text-sm text-gray-400">{category} • {location}</p>
      </div>
      {/* Apply link button carrying hover color fills */}
      <button className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-cyan-500 group-hover:text-white transition-all">
        Apply Now
      </button>
    </div>
  </div>
);

// Export default Careers page functional component
export default function Careers() {
  // Pre-configured list of mock job vacancies
  const openPositions = [
    { title: "Senior AI Engineer", category: "Engineering", location: "Remote / NY" },
    { title: "Legal Content Strategist", category: "Legal", location: "London / Hybrid" },
    { title: "Full Stack Developer", category: "Engineering", location: "Remote" },
  ];

  return (
    // Outer page wrapper with dark blue gradient background
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans">
      {/* Render top navigation header bar */}
      <Navbar />

      {/* Main page center layout grid */}
      <main className="flex-grow pt-32 pb-20 px-6 md:px-20">
        
        {/* Hero Section */}
        {/* Main header title banner */}
        <section className="max-w-4xl mb-20">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Build the Future of Law.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Acina is redefining legal intelligence. We’re looking for curious minds 
            to help us bridge the gap between advanced AI and legal excellence.
          </p>
        </section>

        {/* Values Section */}
        {/* Row grid listing three company pillars */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
          {/* Innovation value statement */}
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Innovation</h4>
            <p className="text-gray-400">We don't just follow AI trends; we set the standard for legal tech.</p>
          </div>
          {/* Integrity value statement */}
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Integrity</h4>
            <p className="text-gray-400">Accuracy and ethics are at the core of every line of code we write.</p>
          </div>
          {/* Inclusion value statement */}
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-sm">Inclusion</h4>
            <p className="text-gray-400">Great ideas come from diverse perspectives and global collaboration.</p>
          </div>
        </section>

        {/* Jobs Section */}
        {/* Header and map of open Positions list */}
        <section>
          <h2 className="text-3xl font-bold mb-10 border-b border-slate-800 pb-4">Open Roles</h2>
          <div className="space-y-4">
            {openPositions.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
        </section>

        {/* Future Roles CTA */}
        {/* Generics outreach section */}
        <section className="mt-20 p-10 rounded-2xl bg-blue-900/20 border border-blue-500/30 text-center">
          <h3 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h3>
          <p className="text-gray-400 mb-6">We are always looking for talented individuals. Send your CV anyway!</p>
          <a href="mailto:careers@acina.com" className="text-cyan-400 hover:underline font-semibold">
            talent@acina.com →
          </a>
        </section>
      </main>

      {/* Render footer bar */}
      <Footer />
    </div>
  );
}