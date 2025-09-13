import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/highlights";

export const addHighlights = async (pdfId, highlights) => {
  try {
    const res = await axios.post(
      API_URL,
      { pdfId, highlights },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to add highlights";
    console.error("Add Highlights Error:", msg);
    throw new Error(msg);
  }
};

export const getHighlights = async (pdfId) => {
  try {
    const res = await axios.get(`${API_URL}/${pdfId}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch highlights";
    console.error("Get Highlights Error:", msg);
    throw new Error(msg);
  }
};

export const updateHighlight = async (id, comment) => {
  try {
    const res = await axios.put(
      `${API_URL}/${id}`,
      { comment },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to update highlight";
    console.error("Update Highlight Error:", msg);
    throw new Error(msg);
  }
};

export const deleteHighlight = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to delete highlight";
    console.error("Delete Highlight Error:", msg);
    throw new Error(msg);
  }
};
