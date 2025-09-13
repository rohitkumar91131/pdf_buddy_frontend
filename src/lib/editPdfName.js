import axios from "axios";

const editPdfName = async (pdfId, newName) => {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/pdfs/${pdfId}`,
      { name: newName },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    const errorMsg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";
    console.error("Edit PDF Name Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

export default editPdfName;
