export const uploadPdf = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pdfs/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        const msg = data.msg || data.message || "File upload failed";
        console.error("Upload PDF Error:", msg);
        throw new Error(msg);
      }
  
      return data;
    } catch (err) {
      const msg = err.message || "Network error while uploading PDF";
      console.error("Upload PDF Fetch Error:", msg);
      throw new Error(msg);
    }
  };
  