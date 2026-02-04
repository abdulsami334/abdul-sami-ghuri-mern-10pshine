import React, { useState } from "react";
import { signupUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await signupUser(form);
      localStorage.setItem("userName", form.name);
      localStorage.setItem("userEmail", form.email);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({
        submit: error.response?.data?.message || "Signup failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

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

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }

        .animate-float { animation: float 20s infinite ease-in-out; }
        .animate-float-delayed { animation: float 20s infinite ease-in-out 7s; }
        .animate-float-more-delayed { animation: float 20s infinite ease-in-out 14s; }
        .animate-slide-up { animation: slideUp 0.6s ease-out; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out 0.2s backwards; }
        .animate-fade-in-delayed { animation: fadeIn 0.8s ease-out 0.4s backwards; }
        .animate-logo-float { animation: logoFloat 3s ease-in-out infinite; }

        .error-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 sm:p-6 lg:p-8 relative overflow-hidden font-['Outfit']">
        {/* Animated background ornaments */}
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full -top-12 -left-12 sm:-top-16 sm:-left-16 lg:-top-20 lg:-left-20 animate-float"></div>
        <div className="absolute w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white/10 rounded-full -bottom-12 -right-12 sm:-bottom-16 sm:-right-16 lg:-bottom-16 lg:-right-16 animate-float-delayed"></div>
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full top-1/2 left-[5%] sm:left-[10%] animate-float-more-delayed"></div>

        {/* Main signup card */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md shadow-2xl relative z-10 animate-slide-up">
          {/* Logo with Feather */}
          <div className="text-center mb-6 lg:mb-8 animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-3 lg:mb-4 flex items-center justify-center animate-logo-float">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="featherGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2563eb', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#60a5fa', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z M45 30 L42 45 L46 45 L45 30 Z M55 30 L54 45 L58 45 L55 30 Z" 
                  fill="url(#featherGradient2)"
                />
              </svg>
            </div>
            
            <h1 className="font-['DM_Serif_Display'] text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-800 mb-2 tracking-tight">
              Join Notera
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Create your account and start organizing your ideas</p>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="animate-fade-in-delayed">
            {/* Name field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={`w-full px-4 py-3 text-sm lg:text-base border-2 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder:text-gray-400 ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 error-shake' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="mb-4">
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
                className={`w-full px-4 py-3 text-sm lg:text-base border-2 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder:text-gray-400 ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 error-shake' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className={`w-full px-4 py-3 text-sm lg:text-base border-2 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white placeholder:text-gray-400 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100 error-shake' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}