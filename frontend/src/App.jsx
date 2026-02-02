import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
// import Dashboard from "./pages/ashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;
