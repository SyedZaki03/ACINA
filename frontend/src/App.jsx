// Import React base library to support JSX components
import React from 'react';

// Export default App functional component (shows a boilerplate landing message)
export default function App() {
  return (
    // Set up a full screen height flex container, styled in light gray background
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Set up a white card wrapper with subtle shadow and rounded borders */}
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        {/* Render a large bold header in blue text */}
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Tailwind is Working!
        </h1>
        {/* Render description copy text in slate gray */}
        <p className="text-gray-700">
          This is a sample component styled with Tailwind CSS.
        </p>
        {/* Render a call-to-action button with hover transition colors */}
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Click Me
        </button>
      </div>
    </div>
  );
}
