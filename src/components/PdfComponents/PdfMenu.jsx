import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ZoomIn, ZoomOut, Download, Loader } from "lucide-react";
import { usePdf } from "../../context/PdfContext";

export default function PdfMenu() {
  const { 
    totalNoOfPages, 
    currentPageNo, 
    setCurrentPageNo,
    scrollToPage,
    goToPreviousPage,
    goToNextPage,
    zoomIn,
    zoomOut,
    downloadPdf,
    downloading
  } = usePdf();

  const [inputValue, setInputValue] = useState(currentPageNo);

  useEffect(() => setInputValue(currentPageNo), [currentPageNo]);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = Number(inputValue);
    if (val >= 1 && val <= totalNoOfPages) {
      setCurrentPageNo(val);
      scrollToPage(val - 1);
    } else {
      setInputValue(currentPageNo);
    }
  };

  return (
    <div className="w-fit flex justify-center items-center space-x-2 sm:space-x-4 z-10 fixed bottom-4 bg-white/80 backdrop-blur-md p-2 sm:p-3 rounded-full shadow-lg">
      <button onClick={goToPreviousPage} className={`p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md ${currentPageNo === 1 ? "disabled opacity-50" : ""}`}>
        <ArrowUp size={18} sm={22} className="text-gray-700" />
      </button>

      <button onClick={goToNextPage} className={`p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md ${currentPageNo === totalNoOfPages ? "disabled opacity-50" : ""}`}>
        <ArrowDown size={18} sm={22} className="text-gray-700" />
      </button>

      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 sm:p-2 rounded-full shadow-md">
        <form onSubmit={handleSubmit}>
          <input
            className="w-12 sm:w-16 p-1 border rounded text-center text-sm sm:text-base"
            min={1}
            max={totalNoOfPages}
            value={inputValue}
            onChange={handleInputChange}
          />
        </form>
        <span className="text-sm sm:text-base">/</span>
        <span className="text-gray-700 font-semibold text-sm sm:text-base">{totalNoOfPages}</span>
      </div>

      <button onClick={zoomIn} className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
        <ZoomIn size={18} sm={22} className="text-gray-700" />
      </button>

      <button onClick={zoomOut} className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
        <ZoomOut size={18} sm={22} className="text-gray-700" />
      </button>

      <button
        onClick={downloadPdf}
        disabled={downloading}
        className={`p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md ${downloading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {downloading ? (
          <Loader size={18} sm={22} className="animate-spin text-gray-700" />
        ) : (
          <Download size={18} sm={22} className="text-gray-700" />
        )}
      </button>
    </div>
  );
}
