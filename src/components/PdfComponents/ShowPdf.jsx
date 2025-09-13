import React, { useEffect, useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import { usePdf } from "../../context/PdfContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import PdfMenu from "./PdfMenu";
import { addHighlights, getHighlights, updateHighlight, deleteHighlight } from "../../lib/highlightApi";
import PdfViewerSkeleton from "../Ui/PdfSkeleton";
import { useAuth } from "../../context/AuthContext";

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
    pdfError,
    setPdfError,
    initialPdfLoading,
    setInitialPdfLoading,
  } = usePdf();

  const { name } = useParams();
  const [pdfId, setPdfId] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [commentBox, setCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeHighlightId, setActiveHighlightId] = useState(null);
  const [hoveredHighlightId, setHoveredHighlightId] = useState(null);
  const [pageLoading, setPageLoading] = useState({});
  const pageRefs = useRef({});
  const {isLogin , setIsLogin}  = useAuth();

  useEffect(() => {
    if(!isLogin){
      return
    }
    loadPdfFromServer();
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [name , isLogin]);



  useEffect(() => {
    if (typeof totalNoOfPages === "number" && totalNoOfPages > 0) {
      setInitialPdfLoading(false);
    }
  }, [totalNoOfPages]);

  const loadPdfFromServer = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdfs/${name}`,
        { responseType: "blob", withCredentials: true }
      );

      const contentType = res.headers?.["content-type"] || res.data?.type || "";
      if (!contentType.includes("application/pdf")) {
        toast.error("Invalid PDF file");
        setPdfError(true);
        setInitialPdfLoading(false);
        return;
      }

      const blob = res.data;
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.message || err.message || "Failed to load PDF";
      toast.error(msg);
      console.error("loadPdfFromServer:", err);
      setInitialPdfLoading(false);
      setPdfError(true);
    }
  };

  useEffect(() => {
    if (!pdfBlobUrl) return;
    const fetchPdfId = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/pdfs/send_id/${name}`,
          { withCredentials: true }
        );

        const data = res.data || {};
        const id = data._id || (data.data && data.data._id) || null;
        if (id) setPdfId(id);
        else {
          console.warn("send_id returned unexpected payload:", data);
        }
      } catch (err) {
        toast.error("Failed to get PDF ID");
        console.error("fetchPdfId:", err);
      }
    };
    fetchPdfId();
  }, [pdfBlobUrl, name]);

  useEffect(() => {
    if (!pdfId) return;
    const fetchHighlights = async () => {
      try {
        const res = await getHighlights(pdfId);
        let arr = [];
        if (Array.isArray(res)) arr = res;
        else if (res && Array.isArray(res.highlights)) arr = res.highlights;
        else if (res && Array.isArray(res.data)) arr = res.data;
        else {
          console.warn("getHighlights returned unexpected:", res);
        }
        setHighlights(arr.map((h) => ({ ...h, id: h._id })));
      } catch (err) {
        toast.error("Failed to load highlights");
        console.error("fetchHighlights:", err);
      }
    };
    fetchHighlights();
  }, [pdfId]);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    parent.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => parent.removeEventListener("scroll", handleScroll);
  }, [handleScroll, rowVirtualizer, totalNoOfPages, parentRef]);

  useEffect(() => {
    const handleMouseUp = (e) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const selectionString = selection.toString();
      if (!selectionString.trim()) {
        selection.removeAllRanges();
        return;
      }
      let range;
      try {
        range = selection.getRangeAt(0);
      } catch {
        selection.removeAllRanges();
        return;
      }
      const rects = range.getClientRects();
      if (!rects.length) {
        selection.removeAllRanges();
        return;
      }

      const pageNumber = Object.keys(pageRefs.current).find((p) => {
        const el = pageRefs.current[p];
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const selRect = rects[0];
        return selRect.top >= rect.top && selRect.bottom <= rect.bottom;
      });

      if (!pageNumber) {
        selection.removeAllRanges();
        return;
      }

      const pageContainer = pageRefs.current[pageNumber];
      const canvasEl = pageContainer && pageContainer.querySelector && pageContainer.querySelector("canvas");
      const containerRect = canvasEl ? canvasEl.getBoundingClientRect() : pageContainer.getBoundingClientRect();

      const relativeRects = Array.from(rects).map((r) => ({
        left: (r.left - containerRect.left) / containerRect.width,
        top: (r.top - containerRect.top) / containerRect.height,
        width: r.width / containerRect.width,
        height: r.height / containerRect.height,
        page: Number(pageNumber),
      }));

      setCommentBox({
        page: Number(pageNumber),
        rects: relativeRects,
        clientX: e.clientX,
        clientY: e.clientY - 40,
        text: selectionString,
      });

      setCommentText("");
      selection.removeAllRanges();
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches && e.changedTouches[0];
      if (!touch) return;
      const simulatedEvent = { clientX: touch.clientX, clientY: touch.clientY };
      handleMouseUp(simulatedEvent);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const addComment = async () => {
    if (!commentBox || !commentText.trim() || !pdfId) return;

    const newHighlight = {
      pdfId,
      page: commentBox.page,
      text: commentBox.text,
      comment: commentText,
      rects: commentBox.rects,
    };

    try {
      const res = await addHighlights(pdfId, [newHighlight]);
      // res might be:
      // 1) an array of saved highlights
      // 2) { success: true, highlights: [...] }
      // 3) { data: [...] }
      let saved = [];
      if (Array.isArray(res)) saved = res;
      else if (res && Array.isArray(res.highlights)) saved = res.highlights;
      else if (res && Array.isArray(res.data)) saved = res.data;
      else saved = [];

      if (saved.length === 0) {
        // fallback: maybe the helper returned the created object directly
        if (res && res._id) saved = [res];
      }

      setHighlights((prev) => [...prev, ...saved.map((h) => ({ ...h, id: h._id }))]);
      setCommentBox(null);
      setCommentText("");
    } catch (err) {
      toast.error("Failed to save highlight");
      console.error("addComment:", err);
    }
  };

  const updateComment = async (id) => {
    if (!id || !commentText.trim()) return;
    try {
      const res = await updateHighlight(id, commentText);
      // res might be { success:true, highlight: {...} } or the updated object
      const updatedObj = res && res.highlight ? res.highlight : res;
      setHighlights((prev) =>
        prev.map((h) => (h.id === id ? { ...h, comment: updatedObj.comment || commentText } : h))
      );
      setActiveHighlightId(null);
      setCommentText("");
    } catch (err) {
      toast.error("Failed to update highlight");
      console.error("updateComment:", err);
    }
  };

  const deleteHighlightFunc = async (id) => {
    try {
      const res = await deleteHighlight(id);
      // res might be { success:true, message } or a simple acknowledgement
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      if (activeHighlightId === id) setActiveHighlightId(null);
    } catch (err) {
      toast.error("Failed to delete highlight");
      console.error("deleteHighlightFunc:", err);
    }
  };

  const pageWidth = Math.round(window.innerWidth * 0.85 * zoom);

  const handlePageLoadSuccess = (page, index) => {
    const height = (page.originalHeight / page.originalWidth) * pageWidth;
    setPageHeights((prev) => {
      const newHeights = [...prev];
      newHeights[index] = height;
      return newHeights;
    });
    rowVirtualizer.measure();
    setPageLoading((prev) => ({ ...prev, [index + 1]: false }));
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 ">
        <Document
          file={pdfBlobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={(err) => {
            toast.error(err.message || "Failed to render PDF");
            console.error("Document error:", err);
          }}
        >
          {totalNoOfPages > 0 && (
            <div
              ref={parentRef}
              style={{ height: "100vh", width: "100vw", overflowY: "auto", position: "relative" }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const pageNumber = virtualRow.index + 1;
                  const isLoading = pageLoading[pageNumber] !== false;
                  const wrapperHeight = pageHeights[virtualRow.index] || 400;

                  return (
                    <div
                      key={virtualRow.key}
                      className="flex justify-center relative "
                      style={{
                        background: "#f5f5f5",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        minHeight: "100px",
                        position: "absolute",
                        top: `${virtualRow.start}px`,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      ref={(el) => {
                        if (el) pageRefs.current[pageNumber] = el;
                      }}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-40">
                          <div className="loader border-t-4 border-blue-500 w-8 h-8 rounded-full animate-spin"></div>
                        </div>
                      )}

                      <div style={{ position: "relative", width: `${pageWidth}px`, height: `${wrapperHeight}px` }} className="flex justify-center">
                        <Page
                          pageNumber={pageNumber}
                          width={pageWidth}
                          renderTextLayer
                          renderAnnotationLayer
                          onLoadSuccess={(page) => handlePageLoadSuccess(page, virtualRow.index)}
                        />

                        {highlights
                          .filter((h) => h.page === pageNumber)
                          .map((h) => (
                            <React.Fragment key={h.id}>
                              {h.rects.map((r, idx) => {
                                const isActive = activeHighlightId === h.id;
                                const isHovered = hoveredHighlightId === h.id;
                                const bg = isActive || isHovered
                                  ? "rgba(255,200,60,0.85)"
                                  : "linear-gradient(180deg, rgba(255,245,157,0.35), rgba(255,223,93,0.28))";
                                const border = "1px solid rgba(255,180,0,0.55)";
                                const boxShadow = isHovered ? "0 8px 20px rgba(255,180,0,0.14)" : "inset 0 1px 0 rgba(255,255,255,0.45)";

                                return (
                                  <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredHighlightId(h.id)}
                                    onMouseLeave={() => setHoveredHighlightId((prev) => (prev === h.id ? null : prev))}
                                    onClick={() => {
                                      setActiveHighlightId(h.id);
                                      setCommentText(h.comment || "");
                                      setCommentBox(null);
                                    }}
                                    style={{
                                      position: "absolute",
                                      left: `${r.left * 100}%`,
                                      top: `${r.top * 100}%`,
                                      width: `${r.width * 100}%`,
                                      height: `${r.height * 100}%`,
                                      background: bg,
                                      border,
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      transition: "background 140ms ease, box-shadow 140ms ease, transform 140ms ease",
                                      transform: isHovered ? "scale(1.01)" : "none",
                                      boxShadow,
                                      zIndex: 60,
                                      pointerEvents: "auto",
                                      backdropFilter: "saturate(120%)",
                                    }}
                                  />
                                );
                              })}
                            </React.Fragment>
                          ))}
                      </div>

                      {activeHighlightId &&
                        !commentBox &&
                        highlights
                          .filter((h) => h.id === activeHighlightId && h.page === pageNumber)
                          .map((h) => {
                            const firstRect = h.rects && h.rects[0];
                            const container = pageRefs.current[pageNumber];
                            const canvasEl = container && container.querySelector && container.querySelector("canvas");
                            const containerRect = canvasEl ? canvasEl.getBoundingClientRect() : container ? container.getBoundingClientRect() : null;
                            const topPx =
                              containerRect && firstRect
                                ? firstRect.top * containerRect.height - 70
                                : -9999;
                            const leftPx =
                              containerRect && firstRect ? firstRect.left * containerRect.width : 0;
                            return (
                              <div
                                key={h.id}
                                style={{
                                  position: "absolute",
                                  top: `${topPx}px`,
                                  left: `${leftPx}px`,
                                  zIndex: 100,
                                  background: "white",
                                  border: "1px solid rgba(200,200,200,0.9)",
                                  padding: "8px",
                                  borderRadius: "6px",
                                  width: "240px",
                                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                                }}
                              >
                                <textarea
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  className="border px-2 py-1 rounded w-full h-20 resize-none"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => updateComment(h.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => deleteHighlightFunc(h.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Document>

        {commentBox && (
          <div
            style={{
              position: "fixed",
              top: commentBox.clientY,
              left: commentBox.clientX,
              background: "white",
              border: "1px solid rgba(200,200,200,0.9)",
              padding: "6px 8px",
              borderRadius: "6px",
              zIndex: 120,
              display: "flex",
              gap: "6px",
              alignItems: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add comment"
              className="border px-2 py-1 rounded w-60 h-20 resize-none"
            />
            <button onClick={addComment} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add
            </button>
          </div>
        )}
      </div>
    </>
  );
}
