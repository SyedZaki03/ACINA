// Import React base library for building component structures
import React from "react";
// Import ReactDOM library to mount and render components in the browser DOM
import ReactDOM from "react-dom/client";
// Import Router, Routes, and Route wrappers from React Router for application navigation
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import custom theme state provider context to toggle dark/light modes
import { ThemeProvider } from './context/ThemeContext';

// Import primary static/public page components
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutPage from "./pages/About";
import FeaturesPage from "./pages/Features";
import ContactPage from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Careers from "./pages/Careers";

// Import authenticated dashboard page components and legal analysis tools
import Dashboard from "./pages/Dashboard/Dashboard";
import GenerateContract from "./pages/Dashboard/GenerateContract";
import RiskAnalysis from "./pages/Dashboard/RiskAnalysis";
import ContractLibrary from "./pages/Dashboard/ContractLibrary";
import Templates from "./pages/Dashboard/Templates";
import Settings from "./pages/Dashboard/Settings";
import Negotiation from "./pages/Dashboard/Negotiation";

// Import legal terms, security, and policy pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Legal from "./pages/Legal";
import Security from "./pages/Security";

// Import global CSS styling settings
import "./index.css";

// Target index.html's 'root' div and render the application inside a React StrictMode wrapper
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap the app with ThemeProvider to grant global theme context variables */}
    <ThemeProvider>
      {/* Set up standard React Router context to support client-side routing */}
      <Router>
        {/* Declare routes lookup container */}
        <Routes>
          {/* Public access page routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/careers" element={<Careers />} />

          {/* Secure dashboard tool routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateContract />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/library" element={<ContractLibrary />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/negotiator" element={<Negotiation />} />

          {/* Policy and legal document routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);