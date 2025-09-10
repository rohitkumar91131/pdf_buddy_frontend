import axios from "axios"

export default async function getAllPdf (){
    try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pdfs`,{
            withCredentials : true,
        })
        return res.data;
    }
    catch(err){
        throw new Error(err.message || "Network error")  
    }
}