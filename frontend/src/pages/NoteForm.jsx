import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNote, getNoteById } from "../api/notes";

export default function NoteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [noteId, setNoteId] = useState(id || null);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeFormat, setActiveFormat] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Detect active formatting
  const updateActiveFormat = () => {
    if (document.queryCommandState) {
      setActiveFormat({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      });
    }
  };

  // Load existing note if editing
  useEffect(() => {
    if (isEdit) {
      (async () => {
        setLoading(true);
        try {
          const res = await getNoteById(id);
          setTitle(res.data.title || "");
          setNoteId(res.data.id);
          
          if (editorRef.current && res.data.content) {
            editorRef.current.innerHTML = res.data.content;
            updateCounts(res.data.content);
          }
        } catch (error) {
          console.error("Error fetching note:", error);
          alert("Failed to load note. Please try again.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id]);

  const updateCounts = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || "";
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      updateCounts(content);
      updateActiveFormat();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    // Prevent multiple submissions
    if (loading) {
      console.log("Already saving, please wait...");
      return;
    }

    setLoading(true);

    try {
      const content = editorRef.current.innerHTML;

      if (noteId) {
        // Update existing note
        console.log("Updating note with ID:", noteId);
        await updateNote(noteId, { title, content });
      } else {
        // Create new note
        console.log("Creating new note");
        const res = await createNote({ title, content });
        const newId = res.data?.id || res.data?.note?.id;
        if (newId) {
          setNoteId(newId);
          console.log("New note created with ID:", newId);
        }
      }

      console.log("Save successful, navigating to dashboard");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setTimeout(updateActiveFormat, 50);
    handleEditorInput();
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    execCommand('fontSize', '7');
    handleEditorInput();
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    execCommand('fontName', font);
    handleEditorInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      const text = window.getSelection().toString() || url;
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-link">${text}</a>`;
      document.execCommand('insertHTML', false, link);
      handleEditorInput();
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      const img = `<img src="${url}" alt="Inserted Image" class="editor-image" />`;
      document.execCommand('insertHTML', false, img);
      handleEditorInput();
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt('Number of rows (1-10):', '3')) || 3;
    const cols = parseInt(prompt('Number of columns (1-8):', '3')) || 3;
    
    if (rows > 0 && cols > 0) {
      let tableHTML = '<table class="editor-table"><tbody>';
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          tableHTML += '<td><br></td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table>';
      document.execCommand('insertHTML', false, tableHTML);
      handleEditorInput();
    }
  };

  const clearFormatting = () => {
    document.execCommand('removeFormat');
    document.execCommand('unlink');
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleEditorInput();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 'b': e.preventDefault(); execCommand('bold'); break;
        case 'i': e.preventDefault(); execCommand('italic'); break;
        case 'u': e.preventDefault(); execCommand('underline'); break;
        case 's': e.preventDefault(); handleSubmit(e); break;
        case 'z': e.preventDefault(); execCommand('undo'); break;
        case 'y': e.preventDefault(); execCommand('redo'); break;
      }
    }
  };

  const fontFamilies = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "'Roboto', sans-serif" },
    { name: "Poppins", value: "'Poppins', sans-serif" },
    { name: "Open Sans", value: "'Open Sans', sans-serif" },
    { name: "Montserrat", value: "'Montserrat', sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    { name: "Arial", value: "Arial, sans-serif" }
  ];

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42];

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your note...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --primary-color: #4361ee;
          --secondary-color: #3a0ca3;
          --accent-color: #7209b7;
          --success-color: #4cc9f0;
        }
        
        .rich-editor {
          min-height: calc(100vh - 280px);
          padding: 48px 56px;
          outline: none;
          font-family: ${fontFamily};
          font-size: ${fontSize}px;
          line-height: 1.8;
          background: white;
          color: #1a1a1a;
          letter-spacing: 0.01em;
        }
        
        .rich-editor:focus {
          outline: none;
          box-shadow: inset 0 0 0 1px #e9ecef;
        }
        
        .rich-editor:empty:before {
          content: attr(placeholder);
          color: #adb5bd;
          font-style: italic;
          pointer-events: none;
        }
        
        /* Typography Styles */
        .rich-editor h1 {
          font-size: 2.5em;
          font-weight: 800;
          margin: 1.2em 0 0.6em 0;
          color: #212529;
          line-height: 1.2;
          letter-spacing: -0.02em;
          border-bottom: 2px solid #f1f3f5;
          padding-bottom: 0.4em;
        }
        
        .rich-editor h2 {
          font-size: 2em;
          font-weight: 700;
          margin: 1.2em 0 0.5em 0;
          color: #343a40;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        
        .rich-editor h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.4em 0;
          color: #495057;
          line-height: 1.4;
        }
        
        .rich-editor p {
          margin: 1em 0;
          text-align: justify;
          text-justify: inter-word;
        }
        
        .rich-editor ul {
          list-style-type: none;
          margin: 1em 0;
          padding-left: 1.5em;
        }
        
        .rich-editor ul li {
          position: relative;
          margin: 0.6em 0;
          padding-left: 1.5em;
        }
        
        .rich-editor ul li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--primary-color);
          font-size: 1.2em;
        }
        
        .rich-editor ol {
          list-style-type: decimal;
          margin: 1em 0;
          padding-left: 2.5em;
          counter-reset: list-counter;
        }
        
        .rich-editor ol li {
          margin: 0.6em 0;
          padding-left: 0.5em;
          counter-increment: list-counter;
          position: relative;
        }
        
        .rich-editor blockquote {
          border-left: 4px solid var(--primary-color);
          padding: 1.2em 2em;
          margin: 1.8em 0;
          background: linear-gradient(to right, #f8f9fa, #fff);
          color: #495057;
          font-style: italic;
          border-radius: 0 12px 12px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        
        .rich-editor .editor-table {
          width: 100%;
          margin: 2em 0;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .rich-editor .editor-table td {
          border: 1px solid #e9ecef;
          padding: 16px;
          min-width: 120px;
          vertical-align: top;
        }
        
        .rich-editor .editor-table tr:first-child td {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }
        
        .rich-editor .text-link {
          color: var(--primary-color);
          text-decoration: none;
          border-bottom: 2px solid rgba(67, 97, 238, 0.3);
          padding-bottom: 1px;
          transition: all 0.2s;
          font-weight: 500;
        }
        
        .rich-editor .text-link:hover {
          border-bottom-color: var(--primary-color);
          color: var(--secondary-color);
        }
        
        .rich-editor .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 1.5em 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        
        .rich-editor .editor-image:hover {
          transform: scale(1.01);
        }
        
        .rich-editor code {
          background: #f8f9fa;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }
        
        .rich-editor pre {
          background: #1a1a1a;
          color: #f8f9fa;
          padding: 1.5em;
          border-radius: 12px;
          margin: 1.5em 0;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          line-height: 1.6;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        /* Toolbar Styles */
        .toolbar-btn {
          padding: 10px 14px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #495057;
          font-weight: 500;
        }

        .toolbar-btn:hover {
          background: linear-gradient(to bottom, #f8f9fa, #fff);
          border-color: #dee2e6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .toolbar-btn.active {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
        }

        .toolbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .toolbar-select {
          padding: 10px 14px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: #495057;
          font-weight: 500;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23495057'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 36px;
        }

        .toolbar-select:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }

        .toolbar-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .toolbar-divider {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, #e9ecef, transparent);
          margin: 0 12px;
        }

        .color-palette {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          padding: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .color-option {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .color-option:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .color-option.selected {
          border-color: #495057;
          transform: scale(1.1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Main Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (editorRef.current.innerHTML.trim() || title.trim()) {
                      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                        navigate("/dashboard");
                      }
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:shadow-md group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Back</span>
                </button>
                
                <div className="relative">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled Document"
                    className="text-2xl font-bold bg-transparent outline-none min-w-[300px] px-4 py-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                    required
                  />
                  {!title.trim() && (
                    <div className="absolute -bottom-6 left-0 text-sm text-rose-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Title is required
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Words</div>
                    <div className="text-lg font-bold text-gray-800">{wordCount}</div>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Chars</div>
                    <div className="text-lg font-bold text-gray-800">{charCount}</div>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={loading || !title.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4-4-4-4m4 4h11" />
                      </svg>
                      {isEdit ? "Update" : "Save Note"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="sticky top-[84px] z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              
              {/* Font Controls */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <select 
                  value={fontFamily}
                  onChange={(e) => changeFontFamily(e.target.value)}
                  className="toolbar-select min-w-[140px] bg-transparent border-0 focus:bg-white"
                >
                  {fontFamilies.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={fontSize}
                  onChange={(e) => changeFontSize(e.target.value)}
                  className="toolbar-select min-w-[80px] bg-transparent border-0 focus:bg-white"
                >
                  {fontSizes.map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>

              <div className="toolbar-divider"></div>

              {/* Formatting Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button 
                  onClick={() => execCommand('bold')} 
                  className={`toolbar-btn min-w-[40px] ${activeFormat.bold ? 'active' : ''}`}
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-bold">B</span>
                </button>

                <button 
                  onClick={() => execCommand('italic')} 
                  className={`toolbar-btn min-w-[40px] ${activeFormat.italic ? 'active' : ''}`}
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic">I</span>
                </button>

                <button 
                  onClick={() => execCommand('underline')} 
                  className={`toolbar-btn min-w-[40px] ${activeFormat.underline ? 'active' : ''}`}
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline">U</span>
                </button>

                <button onClick={() => execCommand('strikeThrough')} className="toolbar-btn min-w-[40px]" title="Strikethrough">
                  <span style={{textDecoration: 'line-through'}}>S</span>
                </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Alignment */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => execCommand('justifyLeft')} className="toolbar-btn" title="Align Left">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </button>

                <button onClick={() => execCommand('justifyCenter')} className="toolbar-btn" title="Align Center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h4M4 12h16M15 16h6" />
                  </svg>
                </button>

                <button onClick={() => execCommand('justifyRight')} className="toolbar-btn" title="Align Right">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-4 6h8" />
                  </svg>
                </button>

                <button onClick={() => execCommand('justifyFull')} className="toolbar-btn" title="Justify">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Lists & Indent */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => execCommand('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button onClick={() => execCommand('insertOrderedList')} className="toolbar-btn" title="Numbered List">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button onClick={() => execCommand('indent')} className="toolbar-btn" title="Increase Indent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />
                  </svg>
                </button>

                <button onClick={() => execCommand('outdent')} className="toolbar-btn" title="Decrease Indent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0V3" />
                  </svg>
                </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Insert Elements */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={insertLink} className="toolbar-btn" title="Insert Link">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>

                <button onClick={insertImage} className="toolbar-btn" title="Insert Image">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <button onClick={insertTable} className="toolbar-btn" title="Insert Table">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Text Format */}
              <select 
                onChange={(e) => execCommand('formatBlock', e.target.value)}
                className="toolbar-select min-w-[140px]"
                defaultValue="p"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
                <option value="blockquote">Quote</option>
                <option value="pre">Code Block</option>
              </select>

              <div className="toolbar-divider"></div>

              {/* Actions */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button onClick={() => execCommand('undo')} className="toolbar-btn" title="Undo (Ctrl+Z)">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>

                <button onClick={() => execCommand('redo')} className="toolbar-btn" title="Redo (Ctrl+Y)">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                  </svg>
                </button>

                <button onClick={clearFormatting} className="toolbar-btn" title="Clear Formatting">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Editor Container */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-3xl">
            <div
              ref={editorRef}
              contentEditable
              className="rich-editor custom-scrollbar"
              suppressContentEditableWarning
              placeholder="Start writing your thoughts here... ✍️"
              onInput={handleEditorInput}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                e.target.style.boxShadow = 'inset 0 0 0 2px #4361ee';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Status Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{fontFamily.split(',')[0]}</span> • {fontSize}px
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{wordCount} words</span>
                <span className="font-semibold text-gray-800">{charCount} chars</span>
              </div>
              
              <div className="text-xs text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+S</kbd> to save
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim()}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95"
          title="Save Note"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4-4-4-4m4 4h11" />
          </svg>
        </button>
      </div>
    </>
  );
}