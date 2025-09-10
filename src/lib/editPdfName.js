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
    console.error(err);
    throw new Error(err.response?.data?.msg || err.message);
  }
};


export default editPdfName