export const uploadPdf = async(formData) =>{
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pdfs/upload`, {
        method: "POST",
        body: formData,
    });
    return res.json();
}