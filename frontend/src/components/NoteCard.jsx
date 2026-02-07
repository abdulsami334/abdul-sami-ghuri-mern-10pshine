// import React from "react";

// export default function NoteCard({ note, onEdit, onDelete, onTogglePin, isPinned, view, delay = 0 }) {
//   const stripHtml = (html) => {
//     const tmp = document.createElement("DIV");
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || "";
//   };

//   const getPreview = () => {
//     const text = stripHtml(note.content || "");
//     return text.substring(0, 150) + (text.length > 150 ? "..." : "");
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diff = now - date;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) return "Today";
//     if (days === 1) return "Yesterday";
//     if (days < 7) return `${days} days ago`;
//     if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   const colors = [
//     "from-blue-50 to-blue-100 border-blue-200",
//     "from-purple-50 to-purple-100 border-purple-200",
//     "from-pink-50 to-pink-100 border-pink-200",
//     "from-green-50 to-green-100 border-green-200",
//     "from-yellow-50 to-yellow-100 border-yellow-200",
//     "from-indigo-50 to-indigo-100 border-indigo-200",
//     "from-red-50 to-red-100 border-red-200",
//     "from-teal-50 to-teal-100 border-teal-200",
//   ];

//   const randomColor = colors[note.id % colors.length];

//   if (view === "list") {
//     return (
//       <div
//         className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 animate-slide-up"
//         style={{ animationDelay: `${delay}ms` }}
//       >
//         <div className="p-5 flex items-center gap-4">
//           <div className={`w-1.5 h-20 rounded-full bg-gradient-to-b ${randomColor}`} />

//           <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(note.id)}>
//             <div className="flex items-center gap-2 mb-2">
//               {isPinned && (
//                 <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
//                 </svg>
//               )}
//               <h3 className="font-bold text-lg text-gray-800 truncate">{note.title}</h3>
//             </div>
//             <p className="text-sm text-gray-600 line-clamp-2">{getPreview()}</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
//               {formatDate(note.created_at)}
//             </span>

//             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onTogglePin(note.id);
//                 }}
//                 className="p-2 hover:bg-yellow-50 rounded-lg transition-all"
//                 title={isPinned ? "Unpin" : "Pin"}
//               >
//                 <svg className={`w-5 h-5 ${isPinned ? 'text-yellow-500' : 'text-gray-400'}`} fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//                 </svg>
//               </button>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete(note.id);
//                 }}
//                 className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
//                 title="Delete"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer animate-slide-up transform hover:-translate-y-1"
//       style={{ animationDelay: `${delay}ms` }}
//       onClick={() => onEdit(note.id)}
//     >
//       <div className={`h-2 bg-gradient-to-r ${randomColor}`} />

//       {isPinned && (
//         <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-600 p-2 rounded-full shadow-md z-10 animate-pulse">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
//           </svg>
//         </div>
//       )}

//       <div className="p-6">
//         <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 pr-8 group-hover:text-blue-600 transition-colors">
//           {note.title}
//         </h3>
//         <p className="text-gray-600 text-sm line-clamp-4 mb-4 leading-relaxed">
//           {getPreview()}
//         </p>

//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <div className="flex items-center gap-2">
//             <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-xs text-gray-500 font-medium">
//               {formatDate(note.created_at)}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onTogglePin(note.id);
//               }}
//               className="p-2 hover:bg-yellow-50 rounded-lg transition-all hover:scale-110"
//               title={isPinned ? "Unpin" : "Pin"}
//             >
//               <svg className={`w-4 h-4 ${isPinned ? 'text-yellow-500' : 'text-gray-400'}`} fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//               </svg>
//             </button>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(note.id);
//               }}
//               className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all hover:scale-110"
//               title="Delete"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-up { 
//           animation: slide-up 0.6s ease-out; 
//           animation-fill-mode: both; 
//         }
//       `}</style>
//     </div>
//   );
// }\




import React from "react";

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, isPinned, view, delay = 0 }) {
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getPreview = () => {
    const text = stripHtml(note.content || "");
    return text.substring(0, 150) + (text.length > 150 ? "..." : "");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const colors = [
    "from-blue-50 to-blue-100 border-blue-200",
    "from-purple-50 to-purple-100 border-purple-200",
    "from-pink-50 to-pink-100 border-pink-200",
    "from-green-50 to-green-100 border-green-200",
    "from-yellow-50 to-yellow-100 border-yellow-200",
    "from-indigo-50 to-indigo-100 border-indigo-200",
    "from-red-50 to-red-100 border-red-200",
    "from-teal-50 to-teal-100 border-teal-200",
  ];

  const randomColor = colors[note.id % colors.length];

  if (view === "list") {
    return (
      <div
        className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 animate-slide-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="p-5 flex items-center gap-4">
          <div className={`w-1.5 h-20 rounded-full bg-gradient-to-b ${randomColor}`} />

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(note.id)}>
            <div className="flex items-center gap-2 mb-2">
              {isPinned && (
                <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                </svg>
              )}
              <h3 className="font-bold text-lg text-gray-800 truncate">{note.title}</h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{getPreview()}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
              {formatDate(note.created_at)}
            </span>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className="p-2 hover:bg-yellow-50 rounded-lg transition-all"
                title={isPinned ? "Unpin" : "Pin"}
              >
                <svg className={`w-5 h-5 ${isPinned ? 'text-yellow-500' : 'text-gray-400'}`} fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer animate-slide-up transform hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onEdit(note.id)}
    >
      <div className={`h-2 bg-gradient-to-r ${randomColor}`} />

      {isPinned && (
        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-600 p-2 rounded-full shadow-md z-10 animate-pulse">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
          </svg>
        </div>
      )}

      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 pr-8 group-hover:text-blue-600 transition-colors">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-4 mb-4 leading-relaxed">
          {getPreview()}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(note.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className="p-2 hover:bg-yellow-50 rounded-lg transition-all hover:scale-110"
              title={isPinned ? "Unpin" : "Pin"}
            >
              <svg className={`w-4 h-4 ${isPinned ? 'text-yellow-500' : 'text-gray-400'}`} fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all hover:scale-110"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { 
          animation: slide-up 0.6s ease-out; 
          animation-fill-mode: both; 
        }
      `}</style>
    </div>
  );
}