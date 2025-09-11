import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { usePdf } from "../../context/PdfContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import PdfMenu from "./PdfMenu";
import PdfLoading from "../Ui/PdfLoading";

export default function ShowPdf() {
  const {
    pdfBlobUrl,
    setPdfBlobUrl,
    totalNoOfPages,
    onDocumentLoadSuccess,
    parentRef,
    rowVirtualizer,
    handleScroll,
    pageHeights,
    setPageHeights,
    zoom,
  } = usePdf();

  const { pdfId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadPdfFromServer();
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [pdfId]);

  async function loadPdfFromServer() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdfs/${pdfId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      console.log(res)
      if (res.data.type !== "application/pdf") {
        toast.error("Invalid PDF file");
        return;
      }
      console.log(res.data)
      setPdfBlobUrl(URL.createObjectURL(res.data));
      setLoading(false);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    parent.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => parent.removeEventListener("scroll", handleScroll);
  }, [handleScroll, rowVirtualizer, totalNoOfPages]);

  if (!pdfBlobUrl) return <p className="text-center mt-10">Loading PDF...</p>;
  if (loading) return <PdfLoading />;

  return (
    <>
      <PdfMenu />
      <div className="w-[100dvw] h-[100dvh] flex flex-col items-center border">
        <Document
          file={pdfBlobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={(err) => toast.error(err.message)}
        >
          {totalNoOfPages > 0 && (
            <div
              ref={parentRef}
              style={{
                height: "100dvh",
                width: "100dvw",
                overflowY: "auto",
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
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Page
                      pageNumber={virtualRow.index + 1}
                      width={window.innerWidth}
                      renderTextLayer
                      renderAnnotationLayer
                      onLoadSuccess={(page) => {
                        const height =
                          (window.innerWidth / page.originalWidth) *
                          page.originalHeight *
                          zoom;
                        setPageHeights((prev) => {
                          const newHeights = [...prev];
                          newHeights[virtualRow.index] = height;
                          return newHeights;
                        });
                        rowVirtualizer.measure(); 
                    }}
                      className="origin-top-left"
                      style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                        width: `${100 / zoom}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Document>
      </div>
    </>
  );
}
