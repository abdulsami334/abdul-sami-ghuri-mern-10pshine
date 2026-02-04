// components/NoteForm.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNote, getNoteById } from "../api/notes";

export default function NoteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "General",
    tags: [],
    pinned: false
  });
  const [newTag, setNewTag] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (isEdit) {
      loadNote();
    } else {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 100);
    }
  }, [isEdit, id]);

  const loadNote = async () => {
    setLoading(true);
    try {
      const res = await getNoteById(id);
      setNote(res.data);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = res.data.content || "<p><br></p>";
          updateWordCount();
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const content = editorRef.current?.innerHTML || "";
      const noteData = { ...note, content };
      
      if (isEdit) {
        await updateNote(id, noteData);
      } else {
        await createNote(noteData);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateWordCount();
  };

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.textContent || "";
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  };

  const formatText = (format) => {
    switch(format) {
      case 'bold': execCommand('bold'); break;
      case 'italic': execCommand('italic'); break;
      case 'underline': execCommand('underline'); break;
      case 'strike': execCommand('strikeThrough'); break;
      case 'h1': execCommand('formatBlock', '<h1>'); break;
      case 'h2': execCommand('formatBlock', '<h2>'); break;
      case 'h3': execCommand('formatBlock', '<h3>'); break;
      case 'paragraph': execCommand('formatBlock', '<p>'); break;
      case 'justifyLeft': execCommand('justifyLeft'); break;
      case 'justifyCenter': execCommand('justifyCenter'); break;
      case 'justifyRight': execCommand('justifyRight'); break;
      case 'insertUnorderedList': execCommand('insertUnorderedList'); break;
      case 'insertOrderedList': execCommand('insertOrderedList'); break;
      case 'indent': execCommand('indent'); break;
      case 'outdent': execCommand('outdent'); break;
      case 'undo': execCommand('undo'); break;
      case 'redo': execCommand('redo'); break;
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      setNote({
        ...note,
        tags: [...note.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNote({
      ...note,
      tags: note.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateWordCount();
  };

  const handleEditorInput = () => {
    updateWordCount();
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note editor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        
        .editor-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          font-size: 16px;
          min-height: 500px;
          padding: 32px;
          outline: none;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .editor-container:empty:before {
          content: attr(placeholder);
          color: #94a3b8;
          pointer-events: none;
          display: block;
        }
        
        .editor-container:focus {
          outline: none;
        }
        
        .editor-container h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
          color: #1e293b;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
        }
        
        .editor-container h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem;
          color: #334155;
        }
        
        .editor-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          color: #475569;
        }
        
        .editor-container p {
          margin-bottom: 1rem;
          color: #374151;
        }
        
        .editor-container ul, 
        .editor-container ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .editor-container ul {
          list-style-type: disc;
        }
        
        .editor-container ol {
          list-style-type: decimal;
        }
        
        .editor-container a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .editor-container img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 8px;
        }
        
        .editor-container blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #64748b;
          font-style: italic;
        }
        
        .editor-container code {
          background-color: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        .editor-container pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .toolbar-button.active {
          background-color: #dbeafe !important;
          color: #1d4ed8 !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Outfit']">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="hidden sm:inline">Back</span>
                </button>
                
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <h1 className="font-['DM_Serif_Display'] text-xl text-gray-800">Notera</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Word Count */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{wordCount} words</span>
                </div>
                
                {/* Save Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={saving || !note.title.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isEdit ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {isEdit ? "Update" : "Save Note"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Note Info */}
          <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-slide-in">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => setNote({...note, title: e.target.value})}
                  placeholder="Untitled Note"
                  className="w-full text-3xl sm:text-4xl font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Pin Toggle */}
                <button
                  onClick={() => setNote({...note, pinned: !note.pinned})}
                  className={`p-2 rounded-lg transition-colors ${note.pinned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title={note.pinned ? "Unpin note" : "Pin note"}
                >
                  {note.pinned ? '📌' : '📍'}
                </button>
                
                {/* Category Select */}
                <select
                  value={note.category}
                  onChange={(e) => setNote({...note, category: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Academic">Academic</option>
                  <option value="Ideas">Ideas</option>
                  <option value="To-Do">To-Do</option>
                </select>
                
                {/* Tags Input */}
                <form onSubmit={addTag} className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="px-3 py-2 border border-gray-300 rounded-l-lg w-32 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </form>
              </div>
            </div>
            
            {/* Tags Display */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Editor Container */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-slide-in" style={{animationDelay: '0.1s'}}>
            {/* Rich Text Toolbar */}
            <div className="border-b border-gray-200 bg-gray-50 p-3">
              <div className="flex flex-wrap items-center gap-1">
                {/* Formatting Group */}
                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => formatText('bold')} className="p-2 rounded hover:bg-gray-200" title="Bold (Ctrl+B)"><b>B</b></button>
                  <button onClick={() => formatText('italic')} className="p-2 rounded hover:bg-gray-200" title="Italic (Ctrl+I)"><i>I</i></button>
                  <button onClick={() => formatText('underline')} className="p-2 rounded hover:bg-gray-200" title="Underline (Ctrl+U)"><u>U</u></button>
                  <button onClick={() => formatText('strike')} className="p-2 rounded hover:bg-gray-200" title="Strikethrough"><s>S</s></button>
                </div>
                
                {/* Headings Group */}
                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                  <select onChange={(e) => formatText(e.target.value)} className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white">
                    <option value="paragraph">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                </div>
                
                {/* Lists Group */}
                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => formatText('insertUnorderedList')} className="p-2 rounded hover:bg-gray-200" title="Bullet List">•</button>
                  <button onClick={() => formatText('insertOrderedList')} className="p-2 rounded hover:bg-gray-200" title="Numbered List">1.</button>
                </div>
                
                {/* Alignment Group */}
                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                  <button onClick={() => formatText('justifyLeft')} className="p-2 rounded hover:bg-gray-200" title="Align Left">←</button>
                  <button onClick={() => formatText('justifyCenter')} className="p-2 rounded hover:bg-gray-200" title="Align Center">↔</button>
                  <button onClick={() => formatText('justifyRight')} className="p-2 rounded hover:bg-gray-200" title="Align Right">→</button>
                </div>
                
                {/* Insert Group */}
                <div className="flex items-center border-r border-gray-300 pr-2 mr-2">
                  <button onClick={insertLink} className="p-2 rounded hover:bg-gray-200" title="Insert Link">🔗</button>
                  <button onClick={insertImage} className="p-2 rounded hover:bg-gray-200" title="Insert Image">🖼️</button>
                </div>
                
                {/* Undo/Redo */}
                <div className="flex items-center">
                  <button onClick={() => formatText('undo')} className="p-2 rounded hover:bg-gray-200" title="Undo (Ctrl+Z)">↶</button>
                  <button onClick={() => formatText('redo')} className="p-2 rounded hover:bg-gray-200" title="Redo (Ctrl+Y)">↷</button>
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="editor-container custom-scrollbar" style={{maxHeight: 'calc(100vh - 300px)'}}>
              <div
                ref={editorRef}
                contentEditable={true}
                onPaste={handlePaste}
                onInput={handleEditorInput}
                className="min-h-[400px] focus:outline-none"
                placeholder="Start typing here..."
                data-placeholder="Start typing here..."
              />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Tip:</span> Use <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Ctrl+B</kbd> for Bold, 
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs mx-1">Ctrl+I</kbd> for Italic
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    {wordCount} words • {Math.ceil(wordCount / 200)} min read
                  </div>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving || !note.title.trim()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : isEdit ? "Update Note" : "Save Note"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}