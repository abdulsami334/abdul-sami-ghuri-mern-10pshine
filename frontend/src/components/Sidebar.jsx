import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onNew }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const menuItems = [
    { id: "all", icon: "📊", label: "All Notes", path: "/dashboard" },
    { id: "recent", icon: "🕐", label: "Recent", path: "/dashboard" },
    { id: "favorites", icon: "⭐", label: "Favorites", path: "/dashboard" },
    { id: "archived", icon: "📦", label: "Archived", path: "/dashboard" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen
          w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          z-40 flex flex-col shadow-xl md:shadow-none
        `}
      >
        {/* Header with Feather Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/feather-logo.png" 
                alt="Notera" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback SVG if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <svg 
                className="w-10 h-10 hidden" 
                viewBox="0 0 100 100" 
                fill="none"
                style={{ display: 'block' }}
              >
                <defs>
                  <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z" 
                  fill="url(#featherGradient)"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notera
              </h2>
              <p className="text-xs text-gray-500">Smart Notes</p>
            </div>
          </div>

          {/* New Note Button */}
          <button
            onClick={onNew}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
                if (window.innerWidth < 768) setIsExpanded(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-1">Go Pro 🚀</h4>
            <p className="text-xs text-gray-600 mb-3">Unlock AI features and unlimited notes</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}