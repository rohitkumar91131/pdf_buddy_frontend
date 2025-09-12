import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/highlights";

export const addHighlights = async (pdfId, highlights) => {
  const res = await axios.post(
    API_URL,
    { pdfId, highlights },
    { withCredentials: true }
  );
  return res.data;
};

export const getHighlights = async (pdfId) => {
  const res = await axios.get(`${API_URL}/${pdfId}`, { withCredentials: true });
  return res.data;
};

export const updateHighlight = async (id, comment) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    { comment },
    { withCredentials: true }
  );
  return res.data;
};

export const deleteHighlight = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
  return res.data;
};
