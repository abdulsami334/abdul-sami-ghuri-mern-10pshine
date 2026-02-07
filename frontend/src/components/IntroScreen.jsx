// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function IntroScreen({ onComplete }) {
//   const [step, setStep] = useState(1);
//   const [showContent, setShowContent] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user already has a name in localStorage
//     const savedName = localStorage.getItem("userName");
//     if (savedName) {
//       // Skip intro if user already has a name
//       onComplete(savedName);
//       return;
//     }

//     const timer1 = setTimeout(() => setStep(2), 1000);
//     const timer2 = setTimeout(() => setStep(3), 2000);
//     const timer3 = setTimeout(() => {
//       setStep(4);
//       setShowContent(true);
//     }, 3000);
    
//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(timer3);
//     };
//   }, [onComplete]);

//   const handleGetStarted = () => {
//     // Set a default name since user is coming from signup
//     // In reality, we should get this from localStorage or props
//     const defaultName = "New User";
//     localStorage.setItem("userName", defaultName);
//     localStorage.setItem("hasVisited", "true");
//     onComplete(defaultName);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-4 h-4 bg-white/20 rounded-full animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${Math.random() * 10 + 10}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 max-w-2xl w-full text-center">
//         {/* Logo Animation */}
//         <div className="mb-8">
//           <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center animate-bounce-slow shadow-2xl">
//             <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
//               <path 
//                 d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z M45 30 L42 45 L46 45 L45 30 Z M55 30 L54 45 L58 45 L55 30 Z" 
//                 fill="white"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Welcome Text */}
//         <div className="mb-12">
//           <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
//               Welcome to Notera
//             </span>
//           </h1>
//           {step >= 2 && (
//             <p className="text-2xl text-white/90 font-medium animate-slide-up">
//               Your Digital Notebook Awaits 📝
//             </p>
//           )}
//         </div>

//         {/* Features Animation */}
//         {showContent && (
//           <div className="space-y-6 animate-slide-up">
//             <div className="grid md:grid-cols-3 gap-6 mb-8">
//               {[
//                 { 
//                   icon: "🚀", 
//                   title: "Instant Start", 
//                   desc: "Start taking notes in seconds with our intuitive interface" 
//                 },
//                 { 
//                   icon: "✨", 
//                   title: "Smart Organization", 
//                   desc: "Auto-categorize and tag your notes for easy retrieval" 
//                 },
//                 { 
//                   icon: "🌐", 
//                   title: "Cloud Sync", 
//                   desc: "Access your notes anywhere, on any device" 
//                 },
//               ].map((feature, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-500 animate-feature-pop"
//                   style={{ animationDelay: `${idx * 200}ms` }}
//                 >
//                   <div className="text-4xl mb-4 animate-icon-float">{feature.icon}</div>
//                   <h3 className="text-xl font-semibold text-white mb-2">
//                     {feature.title}
//                   </h3>
//                   <p className="text-white/70">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>

//             {/* More Features Grid */}
//             <div className="grid md:grid-cols-2 gap-4 mb-8">
//               {[
//                 { icon: "🔒", text: "End-to-End Encryption" },
//                 { icon: "🔍", text: "Smart Search" },
//                 { icon: "📱", text: "Mobile Optimized" },
//                 { icon: "🎨", text: "Rich Text Editor" },
//               ].map((item, idx) => (
//                 <div 
//                   key={idx}
//                   className="flex items-center gap-3 bg-white/5 rounded-xl p-4 animate-fade-in"
//                   style={{ animationDelay: `${1200 + idx * 100}ms` }}
//                 >
//                   <span className="text-2xl">{item.icon}</span>
//                   <span className="text-white/80">{item.text}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-12 animate-fade-in" style={{ animationDelay: '1800ms' }}>
//               <button
//                 onClick={handleGetStarted}
//                 className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-semibold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/25 animate-pulse-slow"
//               >
//                 <span className="flex items-center justify-center gap-3">
//                   Enter Notera
//                   <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                   </svg>
//                 </span>
//               </button>
              
//               <div className="mt-6 text-white/50 text-sm">
//                 <p>Join thousands of users who trust Notera for their note-taking needs</p>
//                 <div className="flex items-center justify-center gap-4 mt-4">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 -ml-2 first:ml-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
//                         {i === 4 ? "+" : "U"}
//                       </div>
//                     ))}
//                   </div>
//                   <span>5,000+ Active Users</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading Animation */}
//         {!showContent && (
//           <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
//             <div className="relative">
//               <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
//                   style={{ width: `${step * 33}%` }}
//                 />
//               </div>
//               <div className="absolute -top-8 left-0 right-0 text-center">
//                 <div className="text-white/70 text-sm animate-pulse">
//                   {step === 1 && "🔄 Loading your workspace..."}
//                   {step === 2 && "✨ Setting up smart features..."}
//                   {step === 3 && "🚀 Preparing your dashboard..."}
//                 </div>
//               </div>
//             </div>
//             <div className="text-white/50 text-sm">
//               <p>Experience the future of note-taking</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Floating particles */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
//           50% { transform: translateY(-30px) rotate(180deg); opacity: 0.5; }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes bounce-slow {
//           0%, 100% { transform: translateY(0) scale(1); }
//           50% { transform: translateY(-20px) scale(1.05); }
//         }
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.9; transform: scale(0.98); }
//         }
//         @keyframes feature-pop {
//           0% { opacity: 0; transform: translateY(20px) scale(0.9); }
//           100% { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes icon-float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
//         .animate-float { animation: float infinite linear; }
//         .animate-fade-in { animation: fade-in 1s ease-out; }
//         .animate-slide-up { animation: slide-up 1s ease-out; }
//         .animate-bounce-slow { animation: bounce-slow 3s infinite; }
//         .animate-pulse-slow { animation: pulse-slow 2s infinite; }
//         .animate-feature-pop { animation: feature-pop 0.6s ease-out; animation-fill-mode: both; }
//         .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
//       `}</style>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";

export default function IntroScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 1000);
    const timer2 = setTimeout(() => setStep(3), 2000);
    const timer3 = setTimeout(() => {
      setStep(4);
      setShowContent(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleGetStarted = () => {
    // Get the user name from localStorage (already set during signup/login)
    const savedName = localStorage.getItem("userName") || "User";
    localStorage.setItem("hasVisited", "true");
    onComplete(savedName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center animate-bounce-slow shadow-2xl">
            <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
              <path 
                d="M50 10 C30 20, 20 35, 15 50 C15 55, 17 60, 20 63 L25 68 C28 65, 30 60, 32 55 C35 45, 40 35, 50 25 C60 35, 65 45, 68 55 C70 60, 72 65, 75 68 L80 63 C83 60, 85 55, 85 50 C80 35, 70 20, 50 10 Z M50 25 L48 40 L52 40 L50 25 Z M35 55 C33 58, 31 61, 28 64 L30 66 C33 63, 35 60, 37 57 Z M65 55 C67 58, 69 61, 72 64 L70 66 C67 63, 65 60, 63 57 Z M45 30 L42 45 L46 45 L45 30 Z M55 30 L54 45 L58 45 L55 30 Z" 
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
              Welcome to Notera
            </span>
          </h1>
          {step >= 2 && (
            <p className="text-2xl text-white/90 font-medium animate-slide-up">
              Your Digital Notebook Awaits 📝
            </p>
          )}
        </div>

        {/* Features Animation */}
        {showContent && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { 
                  icon: "🚀", 
                  title: "Instant Start", 
                  desc: "Start taking notes in seconds" 
                },
                { 
                  icon: "✨", 
                  title: "Smart Organization", 
                  desc: "Auto-categorize and tag your notes" 
                },
                { 
                  icon: "🌐", 
                  title: "Cloud Sync", 
                  desc: "Access anywhere, on any device" 
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-500 animate-feature-pop"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  <div className="text-4xl mb-4 animate-icon-float">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 animate-fade-in" style={{ animationDelay: '1800ms' }}>
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-semibold py-4 px-12 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/25 animate-pulse-slow"
              >
                <span className="flex items-center justify-center gap-3">
                  Enter Notera
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {!showContent && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${step * 33}%` }}
                />
              </div>
              <div className="absolute -top-8 left-0 right-0 text-center">
                <div className="text-white/70 text-sm animate-pulse">
                  {step === 1 && "🔄 Loading your workspace..."}
                  {step === 2 && "✨ Setting up smart features..."}
                  {step === 3 && "🚀 Preparing your dashboard..."}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.5; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); }
        }
        @keyframes feature-pop {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float infinite linear; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 1s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }
        .animate-feature-pop { animation: feature-pop 0.6s ease-out; animation-fill-mode: both; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}