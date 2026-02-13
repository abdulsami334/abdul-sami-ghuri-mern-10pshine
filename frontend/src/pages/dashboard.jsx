import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NoteCard from "../components/NoteCard";
import IntroScreen from "../components/IntroScreen";
import { getNotes, deleteNote, pinNote, unpinNote } from "../api/notes";
import { getMyProfile } from "../api/auth";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [userName, setUserName] = useState("");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    console.log("📊 Dashboard mounted");
    
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("🔐 No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // Get user name from localStorage
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  
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

    // Check if first visit
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowIntro(true);
      setLoading(false);
      return;
    }

    loadNotes();
  }, [navigate]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      console.log("📥 Fetching notes...");
      const res = await getNotes();
      console.log("📥 Notes API response:", res);
      
      // Handle different response structures
      let notesData = [];
      
      if (res.data) {
        if (Array.isArray(res.data)) {
          notesData = res.data;
        } else if (Array.isArray(res.data.notes)) {
          notesData = res.data.notes;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          notesData = res.data.data;
        }
      }
      
      console.log("📥 Processed notes:", notesData);
      setNotes(notesData);
      
    } catch (error) {
      console.error("❌ Error loading notes:", error);
      // Set empty array on error
      setNotes([]);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIntroComplete = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
    localStorage.setItem("hasVisited", "true");
    setShowIntro(false);
    loadNotes();
  };

  const togglePin = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (note?.is_pinned) {
        await unpinNote(noteId);
      } else {
        await pinNote(noteId);
      }
      loadNotes(); // Refresh notes
    } catch (error) {
      console.error("❌ Error toggling pin:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        loadNotes(); // Refresh notes
      } catch (error) {
        console.error("❌ Error deleting note:", error);
      }
    }
  };

  // Safe filtering
  const filtered = Array.isArray(notes) 
    ? notes.filter((n) => {
        if (!n) return false;
        const titleMatch = n.title?.toLowerCase().includes(search.toLowerCase()) || false;
        const contentMatch = n.content?.toLowerCase().includes(search.toLowerCase()) || false;
        return titleMatch || contentMatch;
      })
    : [];

  const pinned = filtered.filter(n => n?.is_pinned);
  const unpinned = filtered.filter(n => !n?.is_pinned);

  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar onNew={() => navigate("/create")} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-gray-600">
                {notes.length === 0 
                  ? "Start creating your first note" 
                  : `You have ${notes.length} note${notes.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded transition ${view === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Grid View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded transition ${view === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  title="List View"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              {/* New Note Button - Mobile */}
              <button
                onClick={() => navigate("/create")}
                className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition shadow-sm"
            />
          </div>
        </div>

        {/* Empty State */}
        {!notes || notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-32 h-32 mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Start capturing your thoughts, ideas, and important information
            </p>
            <button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <>
            {/* Pinned Notes */}
            {pinned.length > 0 && (
              <div className="mb-8 animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                  </svg>
                  <h2 className="text-xl font-bold text-gray-800">Pinned Notes</h2>
                </div>
                <div className={view === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "space-y-3"}>
                  {pinned.map((note, index) => (
                    <NoteCard
                      key={note.id || index}
                      note={note}
                      onEdit={(id) => navigate(`/edit/${id}`)}
                      onDelete={handleDelete}
                      onTogglePin={togglePin}
                      isPinned={true}
                      view={view}
                      delay={index * 100}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Notes */}
            {unpinned.length > 0 && (
              <div className="animate-slide-up" style={{animationDelay: '200ms'}}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {pinned.length > 0 ? "All Notes" : "Recent Notes"}
                </h2>
                <div className={view === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "space-y-3"}>
                  {unpinned.map((note, index) => (
                    <NoteCard
                      key={note.id || index}
                      note={note}
                      onEdit={(id) => navigate(`/edit/${id}`)}
                      onDelete={handleDelete}
                      onTogglePin={togglePin}
                      isPinned={false}
                      view={view}
                      delay={(index + pinned.length) * 100}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filtered.length === 0 && search.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No notes found matching "{search}"</p>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; animation-fill-mode: both; }
      `}</style>
    </div>
  );
}