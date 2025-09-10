import { createContext, useContext, useState } from "react";

const PdfContext = createContext();
export const PdfProvider = ({children}) =>{
    const [pdfUrl, setPdfUrl ] = useState(null);
    const [pdfFileDetails , setPdfFileDetails] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [allPdfs, setAllPdfs] = useState([]);
    const [pdfBlobUrl , setPdfBlobUrl] = useState("");
    
    return <PdfContext.Provider value={{ pdfBlobUrl , setPdfBlobUrl ,pdfUrl, setPdfUrl ,pdfFileDetails , setPdfFileDetails ,uploading, setUploading ,progress, setProgress ,allPdfs, setAllPdfs}}>
        {children}
    </PdfContext.Provider>
}

export const usePdf = () =>useContext(PdfContext);