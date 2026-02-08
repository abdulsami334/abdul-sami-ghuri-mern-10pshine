// import axios from "axios";

// const API_URL = "http://localhost:5000/api/notes";

// const getAuthHeader = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
// });

// export const getNotes = () => axios.get(API_URL, getAuthHeader());
// export const getNoteById = (id) => axios.get(`${API_URL}/${id}`, getAuthHeader());
// export const createNote = (data) => axios.post(API_URL, data, getAuthHeader());
// export const updateNote = (id, data) => axios.put(`${API_URL}/${id}`, data, getAuthHeader());
// export const deleteNote = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeader());
// export const pinNote = (id) => axios.put(`${API_URL}/${id}/pin`, {}, getAuthHeader());
// export const unpinNote = (id) => axios.put(`${API_URL}/${id}/unpin`, {}, getAuthHeader());

import API from "./axios";

// Get all notes
export const getNotes = async () => {
  try {
    const response = await API.get("/notes");
    return response;
  } catch (error) {
    console.error("Get notes API error:", error);
    throw error;
  }
};

// Get single note by ID
export const getNoteById = async (id) => {
  try {
    const response = await API.get(`/notes/${id}`);
    return response;
  } catch (error) {
    console.error("Get note API error:", error);
    throw error;
  }
};

// Create new note
export const createNote = async (noteData) => {
  try {
    const response = await API.post("/notes", noteData);
    return response;
  } catch (error) {
    console.error("Create note API error:", error);
    throw error;
  }
};

// Update note
export const updateNote = async (id, noteData) => {
  try {
    const response = await API.put(`/notes/${id}`, noteData);
    return response;
  } catch (error) {
    console.error("Update note API error:", error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (id) => {
  try {
    const response = await API.delete(`/notes/${id}`);
    return response;
  } catch (error) {
    console.error("Delete note API error:", error);
    throw error;
  }
};

// Pin note
export const pinNote = async (id) => {
  try {
    const response = await API.put(`/notes/${id}/pin`);
    return response;
  } catch (error) {
    console.error("Pin note API error:", error);
    throw error;
  }
};

// Unpin note
export const unpinNote = async (id) => {
  try {
    const response = await API.put(`/notes/${id}/unpin`);
    return response;
  } catch (error) {
    console.error("Unpin note API error:", error);
    throw error;
  }
};

// Get notes stats (total + pinned)
export const getNotesStats = async () => {
  try {
    const response = await API.get("/notes/stats");
    return response;
  } catch (error) {
    console.error("Get notes stats API error:", error);
    throw error;
  }
};

export default API;