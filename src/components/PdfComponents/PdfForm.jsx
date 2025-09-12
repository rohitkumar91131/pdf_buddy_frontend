import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { usePdf } from "../../context/PdfContext";
import { UploadCloud, Minus, FileEdit } from "lucide-react";
import PdfDetails from "./PdfDetails";
import axios from "axios";
import verifyUser from "../../lib/verify";
import { useNavigate } from "react-router-dom";

export default function PdfDragDrop() {
  const { pdfFileDetails, setPdfFileDetails, setPdfUrl ,uploading, setUploading ,progress, setProgress} = usePdf();
  const [isDragging, setIsDragging] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return toast.error("File not found");
    if (file.type !== "application/pdf") return toast.error("Only PDF files allowed");
    setPdfFileDetails(file);
    setPdfUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFileDetails(file);
    setPdfUrl(URL.createObjectURL(file));
  };

  const handleUploadAndEdit = async () => {
    const res = await verifyUser();
    if (!res.success) {
      toast.error("Please login to upload");
      return;
    }
    if (!pdfFileDetails) return toast.error("No PDF selected");

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", pdfFileDetails);

    const toastId = toast.loading("Uploading PDF...");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/pdfs/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
            toast.loading(`Uploading... ${percent}%`, { id: toastId });
          },
          withCredentials: true,
        }
      );

      console.log(res.data)

      if (res.data.success) {
        toast.success("Upload successful!", { id: toastId });
        setProgress(100);
        if (res.data.success) {
          navigate(`/${res.data.file.name}`);
        }
      } else {
        toast.error(res.data.msg || "Upload failed!", { id: toastId });
        setProgress(0);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong!", { id: toastId });
      setProgress(0);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4">
      {showDropzone && (
        <div
          className={`w-full max-w-3xl h-64 md:h-80 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all ${
            isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          {pdfFileDetails && (
            <Minus
              className="absolute top-2 right-2 w-6 h-6 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropzone(false);
              }}
            />
          )}
          <UploadCloud className="w-12 h-12 text-indigo-600 mb-3" />
          <p className="text-gray-600 text-center text-sm md:text-base">
            Drag & Drop your PDF here <br /> or click to select
          </p>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={inputRef}
            onChange={handleFileSelect}
          />
        </div>
      )}

      {!showDropzone && (
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => setShowDropzone(true)}
        >
          Show Dropzone
        </button>
      )}

      {pdfFileDetails && (
        <div className="w-full max-w-3xl mt-4 flex flex-col gap-2">
          <PdfDetails />

          {uploading && (
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors mt-2"
            onClick={handleUploadAndEdit}
            disabled={uploading}
          >
            <FileEdit className="w-5 h-5" />
            {!uploading ? "Upload & Edit" : `Uploading... ${progress}%`}
          </button>
        </div>
      )}
    </div>
  );
}
