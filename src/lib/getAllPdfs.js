import axios from "axios";

export default async function getAllPdf() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pdfs`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch PDFs";
    console.error("Get All PDFs Error:", msg);
    throw new Error(msg);
  }
}
