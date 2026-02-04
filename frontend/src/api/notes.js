import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getNotes = () => axios.get(API_URL, getAuthHeader());
export const getNoteById = (id) => axios.get(`${API_URL}/${id}`, getAuthHeader());
export const createNote = (data) => axios.post(API_URL, data, getAuthHeader());
export const updateNote = (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeader());
export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeader());
export const pinNote = (id) => axios.put(`${API_URL}/${id}/pin`, {}, getAuthHeader());
export const unpinNote = (id) => axios.put(`${API_URL}/${id}/unpin`, {}, getAuthHeader());