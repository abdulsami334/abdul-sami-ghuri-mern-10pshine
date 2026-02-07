import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    console.log("Login form submitted:", form);
    
    try {
      console.log("Calling loginUser API...");
      const res = await loginUser(form);
      console.log("Login API response:", res);
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token saved to localStorage:", res.data.token);
        
        // Save user info if available
        if (res.data.user) {
          localStorage.setItem("userName", res.data.user.name || "User");
          localStorage.setItem("userEmail", res.data.user.email || form.email);
        }
        
        // Redirect based on where user came from
        const from = location.state?.from?.pathname || "/dashboard";
        console.log("Redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        throw new Error("No token in response");
      }
      
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.response.status === 404) {
          errorMessage = "User not found";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float 20s infinite ease-in-out 7s; }
        .animate-float-more-delayed { animation: float 20s infinite ease-in-out 14s; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out 0.2s backwards; }
        .animate-fade-in-delayed { animation: fadeIn 0.8s ease-out 0.4s backwards; }
        .animate-pulse-custom { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 animate-float backdrop-blur-3xl"></div>
        <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-16 -right-16 animate-float-delayed backdrop-blur-3xl"></div>
        <div className="absolute w-48 h-48 bg-white/10 rounded-full top-1/2 right-[10%] animate-float-more-delayed backdrop-blur-3xl"></div>

        {/* Main login card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center animate-pulse-custom">
              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="featherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z M45 30 L42 45 L46 45 L45 30 Z M55 30 L54 45 L58 45 L55 30 Z" 
                  fill="url(#featherGrad)"
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Notera
            </h1>
            <p className="text-gray-600">Welcome back! Sign in to continue.</p>
          </div>

          {/* Success message from signup */}
          {location.state?.message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-green-700 text-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{location.state.message}</span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="animate-fade-in-delayed space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded cursor-pointer accent-purple-600" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="w-full px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}