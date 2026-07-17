import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Using HashRouter so the build works on any static host (Netlify, Vercel,
// GitHub Pages, S3, nginx) without extra rewrite/redirect configuration.
// Swap for BrowserRouter + a redirect rule if you'd rather have clean URLs.

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}
