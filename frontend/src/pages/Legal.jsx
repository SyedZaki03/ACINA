// Export default Legal functional page component (simple landing listing legal policies)
export default function Legal() {
  return (
    // Render full screen height container with dark mode text padding
    <div className="min-h-screen pt-32 px-8 text-white">
      {/* Title heading styled in cyan */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">Legal Documents</h1>
      {/* Description copy text block */}
      <p className="text-gray-300 max-w-3xl">
        Access all legal documentation, compliance reports, and policies here.
      </p>
    </div>
  );
}
