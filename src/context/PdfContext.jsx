import { createContext, useContext, useState } from "react";

const PdfContext = createContext();
export const PdfProvider = ({children}) =>{
    const [pdfUrl, setPdfUrl ] = useState(null);
    const [pdfFileDetails , setPdfFileDetails] = useState(null);
    return <PdfContext.Provider value={{pdfUrl, setPdfUrl ,pdfFileDetails , setPdfFileDetails}}>
        {children}
    </PdfContext.Provider>
}

export const usePdf = () =>useContext(PdfContext);