import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMyProfile, updateProfile } from "../api/auth";

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    joinedDate: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    totalNotes: 0,
    pinnedNotes: 0,
    lastActive: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await getMyProfile();
      const user = response.data || response; // ✅ Fix: handle different response structures
      
      setUserData({
        name: user.name || "",
        email: user.email || "",
        joinedDate: user.createdAt || user.created_at || new Date().toISOString()
      });
      
      setEditForm({
        name: user.name || "",
        email: user.email || ""
      });

      // Update localStorage
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("userEmail", user.email || "");

      // Load stats (you can get this from backend too)
      setStats({
        totalNotes: user.totalNotes || 0,
        pinnedNotes: user.pinnedNotes || 0,
        lastActive: new Date().toLocaleDateString()
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile. Please try again.");
      
      // Fallback to localStorage
      setUserData({
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "",
        joinedDate: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await updateProfile(editForm);
      const updatedUser = response.data || response;
      
      // Update local state
      setUserData({
        ...userData,
        name: updatedUser.name || editForm.name,
        email: updatedUser.email || editForm.email
      });

      // Update localStorage
      localStorage.setItem("userName", editForm.name);
      localStorage.setItem("userEmail", editForm.email);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to update profile. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: userData.name,
      email: userData.email
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("hasVisited");
      navigate("/login");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Sidebar onNew={() => navigate("/create")} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar onNew={() => navigate("/create")} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="max-w-4xl">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-green-700 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-xl">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                      <h2 className="text-3xl font-bold text-gray-800">{userData.name || "User"}</h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit Profile"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 mb-1">{userData.email || "No email provided"}</p>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(userData.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-2xl font-bold text-blue-600">{stats.totalNotes}</p>
                <p className="text-sm text-gray-600">Total Notes</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                </svg>
                <p className="text-2xl font-bold text-purple-600">{stats.pinnedNotes}</p>
                <p className="text-sm text-gray-600">Pinned Notes</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 text-pink-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold text-pink-600">{stats.lastActive}</p>
                <p className="text-sm text-gray-600">Last Active</p>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Settings
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/change-password")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Change Password</p>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Danger Zone
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}