import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { usePdf } from "../../context/PdfContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import isWorkerInitialized from "../../lib/isWorkerInitialized";
import PdfLoading from "../Ui/PdfLoading";

function ShowPdf() {
  const [totalNoOfPages, setTotalNoOfPages] = useState(null);
  const { pdfBlobUrl, setPdfBlobUrl } = usePdf();
  const { pdfId } = useParams();
  const [loading , setLoading]  = useState(true);

  useEffect(() => {

    setTimeout(()=>{
      setLoading(false)
    },10000)
    const result = isWorkerInitialized();
    console.log(result)
    loadPdfFromServer();
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [pdfId]);

  async function loadPdfFromServer() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdfs/${pdfId}`,
        { responseType: "blob", withCredentials: true }
      );

      if (res.data.type !== "application/pdf") {
        toast.error("Invalid PDF file");
        return;
      }

      const blobUrl = URL.createObjectURL(res.data);
      setPdfBlobUrl(blobUrl);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const width = window.innerWidth * 0.6;

  function onDocumentLoadSuccess({ numPages }) {
    setTotalNoOfPages(numPages);
  }

  if (!pdfBlobUrl) {
    return <p className="text-center mt-10">Loading PDF...</p>;
  }

  if(loading){
    return <PdfLoading/>
  }

  return (
    <div className="w-[100dvw] h-[100dvh] overflow-x-hidden overflow-y-auto flex flex-col items-center border">
      <Document
        file={pdfBlobUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onError={(error) => toast.error(error.message)}
      >
        {Array.from({ length: totalNoOfPages }, (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            width={width}
            loading={<p>Loading... Page no {index + 1}</p>}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
      {totalNoOfPages && <p className="mt-4">Total Pages: {totalNoOfPages}</p>}
    </div>
  );
}

export default ShowPdf;
