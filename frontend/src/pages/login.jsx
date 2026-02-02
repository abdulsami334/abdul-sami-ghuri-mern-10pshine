import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import noteraLogo from "../assets/noteralogo.png"; // ADD THIS IMPORT

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(form);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
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
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-4 sm:p-6 lg:p-8 relative overflow-hidden font-['Outfit']">
        {/* Animated background ornaments - Responsive sizes */}
        <div className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full -top-12 -left-12 sm:-top-16 sm:-left-16 lg:-top-20 lg:-left-20 animate-float"></div>
        <div className="absolute w-36 h-36 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-white/10 rounded-full -bottom-12 -right-12 sm:-bottom-16 sm:-right-16 lg:-bottom-16 lg:-right-16 animate-float-delayed"></div>
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full top-1/2 right-[5%] sm:right-[10%] animate-float-more-delayed"></div>

        {/* Main login card */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md shadow-2xl relative z-10 animate-slide-up">
          {/* Logo and branding */}
          <div className="text-center mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-2 sm:mb-3 lg:mb-4 rounded-full flex items-center justify-center shadow-lg animate-logo-float overflow-hidden">
              {/* <img 
                src={noteraLogo}
                alt="Notera Logo"
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-white font-bold text-2xl sm:text-3xl lg:text-4xl">N</div>';
                }}
              /> */}
<img 
              src={noteraLogo} 
              alt="Notera Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 drop-shadow-lg animate-logo-float object-contain"
            />
            </div>
            
            <h1 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl lg:text-4xl font-normal text-slate-800 mb-1 sm:mb-2 tracking-tight">
              Notera
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm lg:text-base">Welcome back! Continue your journey.</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="animate-fade-in-delayed">
            <div className="mb-3 sm:mb-4 lg:mb-5">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ali@example.com"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:-translate-y-0.5 placeholder:text-slate-400"
              />
            </div>

            <div className="mb-3 sm:mb-4 lg:mb-5">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
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
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl bg-slate-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:-translate-y-0.5 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4 sm:mb-5 lg:mb-6 text-xs sm:text-sm">
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer accent-blue-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-500 font-medium hover:text-blue-600 hover:underline transition-colors text-xs sm:text-sm">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative text-center my-3 sm:my-4 lg:my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 sm:px-4 text-slate-400 text-xs sm:text-sm font-medium">or</span>
            </div>

            {/* Continue with Facebook */}
            {/* <button 
              type="button" 
              className="w-full mb-2 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-white bg-blue-600 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-white">
                <path d="M16.5 9.05c0-4.14-3.36-7.5-7.5-7.5S1.5 4.91 1.5 9.05c0 3.74 2.74 6.85 6.34 7.43v-5.26H5.7V9.05h2.14V7.14c0-2.12 1.26-3.29 3.19-3.29.92 0 1.89.16 1.89.16v2.08h-1.06c-1.05 0-1.38.65-1.38 1.32v1.58h2.34l-.38 2.42H9.28v5.26c3.6-.58 6.34-3.69 6.34-7.43z"/>
              </svg>
              <span className="hidden xs:inline">Continue with Facebook</span>
              <span className="xs:hidden">Facebook</span>
            </button> */}

            {/* Continue with Google */}
            {/* <button 
              type="button" 
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              <span className="hidden xs:inline">Continue with Google</span>
              <span className="xs:hidden">Google</span>
            </button> */}

            <p className="text-center text-slate-500 text-xs sm:text-sm lg:text-base mt-4 sm:mt-5 lg:mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}











