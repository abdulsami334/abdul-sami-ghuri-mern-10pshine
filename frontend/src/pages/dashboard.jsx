import React from "react";

export default function Dashboard() {
  const notes = [
    { id: 1, title: "DBMS Notes", date: "Today" },
    { id: 2, title: "Machine Learning", date: "Yesterday" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold text-blue-600 mb-6">Notera</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="font-semibold">Dashboard</li>
          <li>Recent</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            + New Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded shadow hover:shadow-md"
            >
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-500">{note.date}</p>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
