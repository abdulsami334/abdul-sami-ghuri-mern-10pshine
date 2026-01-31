import api from "./axios";

// Signup
export const signupUser = (data) => {
  return api.post("/auth/signup", data);
};

// Login
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};
