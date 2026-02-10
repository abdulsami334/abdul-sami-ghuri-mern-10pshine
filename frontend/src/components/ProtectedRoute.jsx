// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// }


// components/ProtectedRoute.jsx
// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  console.log("🔒 ProtectedRoute: Checking authentication...");
  
  const token = localStorage.getItem('token');
  console.log("🔒 Token found:", token ? "Yes" : "No");
  
  if (!token) {
    console.log("🔒 No token, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("🔒 Token valid, rendering children");
  return children;
};

export default ProtectedRoute;