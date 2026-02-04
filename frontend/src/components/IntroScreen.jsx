import React, { useState } from "react";

export default function IntroScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const steps = [
    {
      title: "Welcome to Notera",
      subtitle: "Your intelligent note-taking companion",
      icon: (
        <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      title: "Organize Your Thoughts",
      subtitle: "Create, edit, and manage notes with ease",
      icon: (
        <svg className="w-24 h-24 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: "Rich Text Editing",
      subtitle: "Format your notes just like a Word document",
      icon: (
        <svg className="w-24 h-24 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: "What's your name?",
      subtitle: "Let's personalize your experience",
      isInput: true,
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === steps.length - 1) {
      if (name.trim()) {
        onComplete(name);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onComplete("User");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === step ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-scale-in">
          {currentStep.isInput ? (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 mb-8">{currentStep.subtitle}</p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center text-lg"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleNext()}
              />
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="flex justify-center mb-6">
                {currentStep.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStep.subtitle}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={currentStep.isInput && !name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {step === steps.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 transition text-sm"
          >
            Skip introduction
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}