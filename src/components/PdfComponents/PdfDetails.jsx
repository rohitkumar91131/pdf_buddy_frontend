import React from "react";
import { usePdf } from "../../context/PdfContext";

export default function PdfDetails() {
  const { pdfFileDetails  ,setPdfFileDetails} = usePdf();

  if (!pdfFileDetails) return null;

  const handlePdfNameChange = (e) =>{
    setPdfFileDetails(prev =>({
      ...prev,
      name : e.target.value
    }))
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-md border border-gray-200 max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-2">PDF Details</h2>
      <span>
      <p>Name :- </p>
      <textarea 
         className="border  w-full text-center"
         value={pdfFileDetails.name}
         placeholder="enter name"
         onChange={handlePdfNameChange}
      ></textarea>
      </span>
      <p>
        <strong>Size:</strong> {(pdfFileDetails.size / 1024 / 1024).toFixed(2)} MB
      </p>
      <p><strong>Type:</strong> {pdfFileDetails.type}</p>
    </div>
  );
}
