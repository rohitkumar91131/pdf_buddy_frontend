import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { usePdf } from "../../context/PdfContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import isWorkerInitialized from "../../lib/isWorkerInitialized";
import PdfLoading from "../Ui/PdfLoading";
import { useVirtualizer } from "@tanstack/react-virtual";

function ShowPdf() {
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  const { pdfBlobUrl, setPdfBlobUrl } = usePdf();
  const { pdfId } = useParams();
  const [loading, setLoading] = useState(true);

  const parentRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);

    const result = isWorkerInitialized();
    console.log("Worker initialized:", result);
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
  const pageHeight = 900; // estimate, can be adjusted

  function onDocumentLoadSuccess({ numPages }) {
    setTotalNoOfPages(numPages || 0);
  }

  const rowVirtualizer = useVirtualizer({
    count: totalNoOfPages,
    getScrollElement: () => parentRef.current,
    estimateSize: () => pageHeight,
    overscan: 2,
  });

  if (!pdfBlobUrl) {
    return <p className="text-center mt-10">Loading PDF...</p>;
  }

  if (loading) {
    return <PdfLoading />;
  }

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col items-center border">
      <Document
        file={pdfBlobUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onError={(error) => toast.error(error.message)}
      >
        {totalNoOfPages > 0 ? (
          <div
            ref={parentRef}
            style={{
              height: "100vh",
              width: width + 50,
              overflow: "auto",
              position: "relative",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Page
                    pageNumber={virtualRow.index + 1}
                    width={width}
                    loading={<p>Loading... Page {virtualRow.index + 1}</p>}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center mt-10">Counting pages...</p>
        )}
      </Document>

      {totalNoOfPages > 0 && (
        <p className="mt-4">Total Pages: {totalNoOfPages}</p>
      )}
    </div>
  );
}

export default ShowPdf;
