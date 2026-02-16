


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes } from "../api/notes";
import { getMyProfile } from "../api/auth";

export default function Sidebar({ onNew }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [userName, setUserName] = useState("");
  const [recentNotes, setRecentNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const navigate = useNavigate();

useEffect(() => {

  // first load from localStorage (instant UI)
  const savedName = localStorage.getItem("userName");
  if (savedName) setUserName(savedName);

  const loadUser = async () => {
    try {
      const res = await getMyProfile();
      setUserName(res.data.name);
      localStorage.setItem("userName", res.data.name);
    } catch (err) {
      console.log(err);
    }
  };

  loadUser();
  loadNotes();

}, []);



  const loadNotes = async () => {
    try {
      const res = await getNotes();
      const notes = res.data;
      
      const recent = [...notes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentNotes(recent);

      const pinned = notes.filter(note => note.is_pinned);
      setPinnedNotes(pinned);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const menuItems = [
    { 
      id: "all", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), 
      label: "All Notes", 
      path: "/dashboard",
      badge: null
    },
    { 
      id: "recent", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      label: "Recent", 
      path: "/dashboard",
      badge: recentNotes.length
    },
    { 
      id: "pinned", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ), 
      label: "Pinned Notes", 
      path: "/dashboard",
      badge: pinnedNotes.length
    },
    { 
    id: "profile",            // ✅ NEW
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: "Profile",
    path: "/profile",         // ✅ IMPORTANT
    badge: null
  },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("hasVisited");
    navigate("/login");
  };

  const handleNoteClick = (noteId) => {
    navigate(`/edit/${noteId}`);
    if (window.innerWidth < 768) setIsExpanded(false);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          z-40 flex flex-col shadow-xl md:shadow-none
        `}
      >
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6 animate-slide-in">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z M45 30 L42 45 L46 45 L45 30 Z M55 30 L54 45 L58 45 L55 30 Z" 
                  fill="url(#featherGradient)"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notera
              </h2>
              <p className="text-xs text-gray-500">Smart Notes</p>
            </div>
          </div>

          {/* New Note Button */}
          <button
            onClick={onNew}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              Menu
            </h3>
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                  if (window.innerWidth < 768) setIsExpanded(false);
                }}
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 animate-slide-in
                  ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Recent Notes Section */}
          {recentNotes.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                Recent Notes
              </h3>
              <div className="space-y-1">
                {recentNotes.slice(0, 5).map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note.id)}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      {note.is_pinned && (
                        <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                        </svg>
                      )}
                      <p className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors flex-1">
                        {note.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {/* <div className="pt-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div> */}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-100">
        <div
  onClick={() => navigate("/profile")}
  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-3 cursor-pointer hover:shadow-md transition"
>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{userName || 'User'}</p>
                <p className="text-xs text-gray-600">Free Plan</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}