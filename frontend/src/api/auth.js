import axios from "axios";

// Base URL setup
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Signup user
export const signupUser = async (userData) => {
  try {
    console.log("📤 Making signup request with data:", userData);
    const response = await API.post("/auth/signup", userData);
    console.log("✅ Signup response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Signup API error:", error.response?.data || error.message);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log("📤 Making login request with credentials:", credentials);
    const response = await API.post("/auth/login", credentials);
    console.log("✅ Login response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Login API error:", error.response?.data || error.message);
    throw error;
  }
};

// Get my profile
export const getMyProfile = async () => {
  try {
    console.log("📤 Fetching user profile");
    const response = await API.get("/users/profile");
    console.log("✅ Profile response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Get profile API error:", error.response?.data || error.message);
    throw error;
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  try {
    console.log("📤 Updating profile with data:", profileData);
    const response = await API.put("/users/profile", profileData);
    console.log("✅ Update profile response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Update profile API error:", error.response?.data || error.message);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    console.log("📤 Making change password request");
    const response = await API.put("/auth/change-password", passwordData);
    console.log("✅ Change password response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Change password API error:", error.response?.data || error.message);
    throw error;
  }
};

// Forgot password - send reset email
export const forgotPassword = async (emailData) => {
  try {
    console.log("📤 Requesting password reset for:", emailData.email);
    const response = await API.post("/auth/forgot-password", emailData);
    console.log("✅ Forgot password response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Forgot password API error:", error.response?.data || error.message);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (resetData) => {
  try {
    console.log("📤 Resetting password with token");
    const response = await API.post("/auth/reset-password", resetData);
    console.log("✅ Reset password response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Reset password API error:", error.response?.data || error.message);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    console.log("📤 Verifying email with token");
    const response = await API.get(`/auth/verify-email/${token}`);
    console.log("✅ Verify email response:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Verify email API error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout (client-side only)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("hasVisited");
  console.log("👋 User logged out");
};