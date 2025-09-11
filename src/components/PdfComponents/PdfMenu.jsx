import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, ZoomIn, ZoomOut, Download } from "lucide-react";
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
        downloadPdf
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
        <div className="w-full flex justify-center items-center space-x-4 z-10 fixed bottom-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg">
            <button onClick={goToPreviousPage} className="peer p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                <ArrowUp size={22} className="text-gray-700" />
            </button>

            <button onClick={goToNextPage} className="peer p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                <ArrowDown size={22} className="text-gray-700" />
            </button>

            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full shadow-md">
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-16 p-1 border rounded text-center"
                        min={1}
                        max={totalNoOfPages}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </form>
                <span>/</span>
                <span className="text-gray-700 font-semibold">{totalNoOfPages}</span>
            </div>

            <button onClick={zoomIn} className="peer p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                <ZoomIn size={22} className="text-gray-700" />
            </button>

            <button onClick={zoomOut} className="peer p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                <ZoomOut size={22} className="text-gray-700" />
            </button>

            <button onClick={downloadPdf} className="peer p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                <Download size={22} className="text-gray-700" />
            </button>
        </div>
    );
}
