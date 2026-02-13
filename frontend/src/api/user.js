import axios from "axios";

const API_URL = "http://localhost:5000/api/users";


export const getUserProfile = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};