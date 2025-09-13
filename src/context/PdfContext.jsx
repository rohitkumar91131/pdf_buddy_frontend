import { createContext, useContext, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfFileDetails, setPdfFileDetails] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allPdfs, setAllPdfs] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pageHeights, setPageHeights] = useState([]);
  const parentRef = useRef(null);
  const [pdfError, setPdfError] = useState(false);
  const [initialPdfLoading, setInitialPdfLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')

  const rowVirtualizer = useVirtualizer({
    count: totalNoOfPages,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => pageHeights[index] || window.innerHeight,
    overscan: 2,
  });

  const handleScroll = () => {
    const parent = parentRef.current;
    if (!parent) return;

    const scrollTop = parent.scrollTop;
    const viewportHeight = parent.clientHeight;
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    let maxVisibleHeight = 0;
    let currentIndex = 0;

    for (let item of virtualItems) {
      const itemTop = item.start;
      const itemBottom = item.start + item.size;

      const visibleTop = Math.max(itemTop, scrollTop);
      const visibleBottom = Math.min(itemBottom, scrollTop + viewportHeight);

      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        currentIndex = item.index;
      }
    }

    setCurrentPageNo(currentIndex + 1);
  };

  const scrollToPage = (index) => {
    const parent = parentRef.current;
    if (!parent) return;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += pageHeights[i] || 1000;
    }

    parent.scrollTo({ top: offset, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    setCurrentPageNo((prev) => {
      const newPage = Math.max(prev - 1, 1);
      scrollToPage(newPage - 1);
      return newPage;
    });
  };

  const goToNextPage = () => {
    setCurrentPageNo((prev) => {
      const newPage = Math.min(prev + 1, totalNoOfPages);
      scrollToPage(newPage - 1);
      return newPage;
    });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalNoOfPages) {
      setCurrentPageNo(pageNumber);
      scrollToPage(pageNumber - 1);
    }
  };

  const zoomIn = () => setZoom((prev) => prev + 0.1);
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));

  const downloadPdf = async () => {
    if (!pdfBlobUrl || downloading) return;

    setDownloading(true);
    try {
      const a = document.createElement("a");
      a.href = pdfBlobUrl;
      a.download = `document.pdf`;
      a.click();

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setDownloading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalNoOfPages(numPages || 0);
    setPageHeights(Array(numPages).fill(window.innerHeight));
  };

  return (
    <PdfContext.Provider
      value={{
        pdfUrl,
        setPdfUrl,
        pdfFileDetails,
        setPdfFileDetails,
        uploading,
        setUploading,
        progress,
        setProgress,
        allPdfs,
        setAllPdfs,
        pdfBlobUrl,
        setPdfBlobUrl,
        totalNoOfPages,
        setTotalNoOfPages,
        currentPageNo,
        setCurrentPageNo,
        zoom,
        setZoom,
        pageHeights,
        setPageHeights,
        parentRef,
        rowVirtualizer,
        handleScroll,
        scrollToPage,
        goToPreviousPage,
        goToNextPage,
        goToPage,
        zoomIn,
        zoomOut,
        downloadPdf,
        onDocumentLoadSuccess,
        pdfError,
        setPdfError,
        initialPdfLoading,
        setInitialPdfLoading,
        downloading,
        errorMsg, setErrorMsg      }}
    >
      {children}
    </PdfContext.Provider>
  );
};

export const usePdf = () => useContext(PdfContext);
