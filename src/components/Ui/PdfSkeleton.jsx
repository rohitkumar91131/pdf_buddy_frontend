import { useState } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

export default function PdfViewerSkeleton() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; 

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col bg-gray-100">
      <div className="flex-1 bg-white flex items-center justify-center">
        <p className="text-gray-500">[PDF Page {currentPage}]</p>
      </div>

      <div className="h-14 bg-gray-800 text-white flex items-center justify-between px-4">
        <button
          onClick={goToPreviousPage}
          className="flex items-center gap-2 disabled:opacity-40"
          disabled={currentPage === 1}
        >
          <ArrowLeft size={20} /> Previous
        </button>

        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={goToNextPage}
            className="flex items-center gap-2 disabled:opacity-40"
            disabled={currentPage === totalPages}
          >
            Next <ArrowRight size={20} />
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2">
            <Download size={20} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
