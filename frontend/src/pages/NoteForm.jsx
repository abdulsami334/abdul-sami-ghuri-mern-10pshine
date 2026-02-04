import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNote, getNoteById } from "../api/notes";

export default function NoteForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("Calibri");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        setLoading(true);
        try {
          const res = await getNoteById(id);
          setTitle(res.data.title);
          if (editorRef.current && res.data.content) {
            editorRef.current.innerHTML = res.data.content;
          }
        } catch (error) {
          console.error("Error fetching note:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const content = editorRef.current.innerHTML;
      if (isEdit) await updateNote(id, { title, content });
      else await createNote({ title, content });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    execCommand('fontSize', '7');
    const fontElements = editorRef.current.getElementsByTagName('font');
    for (let element of fontElements) {
      if (element.size === '7') {
        element.removeAttribute('size');
        element.style.fontSize = size + 'px';
      }
    }
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    execCommand('fontName', font);
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Cell</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table><br>';
      document.execCommand('insertHTML', false, tableHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = window.getSelection().toString() || url;
      const link = `<a href="${url}" target="_blank" style="color: #0066cc; text-decoration: underline;">${text}</a>`;
      document.execCommand('insertHTML', false, link);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const img = `<img src="${url}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, img);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rich-editor {
          min-height: 500px;
          padding: 40px;
          outline: none;
          font-family: ${fontFamily}, sans-serif;
          font-size: ${fontSize}px;
          line-height: 1.6;
          background: white;
        }
        
        .rich-editor:focus {
          outline: none;
        }
        
        .rich-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        .rich-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        .rich-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        .rich-editor ul {
          list-style-type: disc;
          margin-left: 40px;
          margin: 1em 0;
        }
        
        .rich-editor ol {
          list-style-type: decimal;
          margin-left: 40px;
          margin: 1em 0;
        }
        
        .rich-editor li {
          margin: 0.5em 0;
        }
        
        .rich-editor blockquote {
          border-left: 4px solid #ccc;
          padding-left: 16px;
          margin: 1em 0;
          color: #666;
        }
        
        .rich-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .rich-editor table td {
          border: 1px solid #ccc;
          padding: 8px;
        }
        
        .toolbar-btn {
          padding: 6px 10px;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
        }
        
        .toolbar-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }
        
        .toolbar-btn:active {
          background: #d1d5db;
        }
        
        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: #d1d5db;
          margin: 0 6px;
        }
        
        .toolbar-select {
          padding: 4px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          font-size: 13px;
          height: 28px;
        }
        
        .toolbar-select:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .color-picker-popup {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          z-index: 50;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>

      <div className="min-h-screen bg-gray-100">
        {/* Top Header */}
        <header className="bg-[#2b2b2b] text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-gray-700 p-2 rounded transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="featherGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z" 
                  fill="url(#featherGradient3)"
                />
              </svg>
              <span className="font-semibold">Notera</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{isEdit ? "Editing Note" : "New Note"}</span>
            <button 
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Toolbar Ribbon */}
        <div className="bg-white border-b border-gray-300">
          {/* Font & Size Row */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
            <select 
              value={fontFamily}
              onChange={(e) => changeFontFamily(e.target.value)}
              className="toolbar-select w-36"
            >
              <option value="Calibri">Calibri</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
            </select>

            <input
              type="number"
              value={fontSize}
              onChange={(e) => changeFontSize(e.target.value)}
              min="8"
              max="96"
              className="toolbar-select w-16"
            />

            <button onClick={() => changeFontSize(parseInt(fontSize) + 2)} className="toolbar-btn" title="Increase Font Size">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <button onClick={() => changeFontSize(Math.max(8, parseInt(fontSize) - 2))} className="toolbar-btn" title="Decrease Font Size">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Main Formatting Row */}
          <div className="flex items-center gap-1 px-4 py-1.5 flex-wrap overflow-x-auto">
            {/* Clipboard */}
            <button onClick={() => execCommand('cut')} className="toolbar-btn" title="Cut">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </button>

            <button onClick={() => execCommand('copy')} className="toolbar-btn" title="Copy">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button onClick={() => execCommand('paste')} className="toolbar-btn" title="Paste">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>

            <div className="toolbar-divider"></div>

            {/* Text Formatting */}
            <button onClick={() => execCommand('bold')} className="toolbar-btn font-bold" title="Bold (Ctrl+B)">
              B
            </button>

            <button onClick={() => execCommand('italic')} className="toolbar-btn italic" title="Italic (Ctrl+I)">
              I
            </button>

            <button onClick={() => execCommand('underline')} className="toolbar-btn underline" title="Underline (Ctrl+U)">
              U
            </button>

            <button onClick={() => execCommand('strikeThrough')} className="toolbar-btn" title="Strikethrough">
              <span style={{textDecoration: 'line-through'}}>S</span>
            </button>

            <button onClick={() => execCommand('subscript')} className="toolbar-btn" title="Subscript">
              X<sub>2</sub>
            </button>

            <button onClick={() => execCommand('superscript')} className="toolbar-btn" title="Superscript">
              X<sup>2</sup>
            </button>

            <div className="toolbar-divider"></div>

            {/* Text Color */}
            <div className="relative">
              <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="toolbar-btn flex flex-col items-center gap-0" 
                title="Text Color"
              >
                <span className="font-bold">A</span>
                <div className="w-4 h-1 bg-red-600"></div>
              </button>
              {showColorPicker && (
                <div className="color-picker-popup">
                  <div className="flex flex-col gap-2">
                    <input
                      type="color"
                      onChange={(e) => {
                        execCommand('foreColor', e.target.value);
                        setShowColorPicker(false);
                      }}
                      className="w-32 h-8 cursor-pointer"
                    />
                    <div className="grid grid-cols-5 gap-1">
                      {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'].map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            execCommand('foreColor', color);
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{backgroundColor: color}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Background Color */}
            <div className="relative">
              <button 
                onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                className="toolbar-btn" 
                title="Highlight Color"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                </svg>
              </button>
              {showBgColorPicker && (
                <div className="color-picker-popup">
                  <div className="flex flex-col gap-2">
                    <input
                      type="color"
                      onChange={(e) => {
                        execCommand('backColor', e.target.value);
                        setShowBgColorPicker(false);
                      }}
                      className="w-32 h-8 cursor-pointer"
                    />
                    <div className="grid grid-cols-5 gap-1">
                      {['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500', '#FFB6C1', '#90EE90', '#ADD8E6', '#DDA0DD', '#F0E68C'].map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            execCommand('backColor', color);
                            setShowBgColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{backgroundColor: color}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="toolbar-divider"></div>

            {/* Alignment */}
            <button onClick={() => execCommand('justifyLeft')} className="toolbar-btn" title="Align Left">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('justifyCenter')} className="toolbar-btn" title="Align Center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('justifyRight')} className="toolbar-btn" title="Align Right">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('justifyFull')} className="toolbar-btn" title="Justify">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>

            <div className="toolbar-divider"></div>

            {/* Lists */}
            <button onClick={() => execCommand('insertUnorderedList')} className="toolbar-btn" title="Bullet List">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zM8 3a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('insertOrderedList')} className="toolbar-btn" title="Numbered List">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM8 3a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8zm0 4a1 1 0 000 2h8a1 1 0 100-2H8z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('indent')} className="toolbar-btn" title="Increase Indent">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm11-9l3 3-3 3V7z" clipRule="evenodd"/>
              </svg>
            </button>

            <button onClick={() => execCommand('outdent')} className="toolbar-btn" title="Decrease Indent">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM13 7l-3 3 3 3V7z" clipRule="evenodd"/>
              </svg>
            </button>

            <div className="toolbar-divider"></div>

            {/* Insert */}
            <button onClick={insertLink} className="toolbar-btn" title="Insert Link">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            <button onClick={insertImage} className="toolbar-btn" title="Insert Image">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button onClick={insertTable} className="toolbar-btn" title="Insert Table">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            <button onClick={() => execCommand('insertHorizontalRule')} className="toolbar-btn" title="Horizontal Line">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </button>

            <div className="toolbar-divider"></div>

            {/* Format */}
            <select 
              onChange={(e) => execCommand('formatBlock', e.target.value)}
              className="toolbar-select w-28"
              defaultValue="p"
            >
              <option value="p">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
              <option value="pre">Preformatted</option>
              <option value="blockquote">Quote</option>
            </select>

            <div className="toolbar-divider"></div>

            {/* Undo/Redo */}
            <button onClick={() => execCommand('undo')} className="toolbar-btn" title="Undo">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>

            <button onClick={() => execCommand('redo')} className="toolbar-btn" title="Redo">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>

            <button onClick={() => execCommand('removeFormat')} className="toolbar-btn" title="Clear Formatting">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="w-full text-2xl md:text-3xl font-bold mb-4 px-4 md:px-6 py-3 md:py-4 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-white rounded-t-lg"
            required
          />

          {/* Rich Text Editor */}
          <div className="bg-white shadow-lg border border-gray-300 rounded-b-lg overflow-hidden">
            <div
              ref={editorRef}
              contentEditable
              className="rich-editor custom-scrollbar"
              suppressContentEditableWarning
            />
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Auto-save: Off</span>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Saving..." : (isEdit ? "Update Note" : "Save Note")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}