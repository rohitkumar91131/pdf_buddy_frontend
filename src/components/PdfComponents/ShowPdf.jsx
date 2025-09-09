import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { usePdf } from "../../context/PdfContext";
import toast from "react-hot-toast";

function ShowPdf() {
  const [totalNoOfPages, setTotalNoOfPages] = useState(null);
  const {pdfUrl, setPdfUrl} = usePdf();



  const width = window.innerWidth * 0.6;

  function onDocumentLoadSuccess({ numPages }) {
    setTotalNoOfPages(numPages);
    console.log("Total pages:", numPages);
  }

  if(!pdfUrl) {
    return ;
  }

  else return (
    <div className="w-[100dvw] h-[100dvh] overflow-x-hidden overflow-y-auto flex justify-center border">
      <Document 
         file={pdfUrl} 
         onLoadSuccess={onDocumentLoadSuccess}
         onError={(error) =>toast.error(error.message)}
      >
         {
            Array.from({length : totalNoOfPages} , (el , index)=>(
                <Page 
                  pageNumber={index+1}
                  width={width}
                  loading = {<p>Loading... Page no {index+1}</p>}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
            ))
         }
      </Document>
      <p>Total Pages: {totalNoOfPages}</p>
    </div>
  );
}

export default ShowPdf;
