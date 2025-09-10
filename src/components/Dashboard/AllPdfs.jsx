import React, { useEffect, useState, useRef } from "react";
import getAllPdfs from "../../lib/getAllPdfs";
import toast from "react-hot-toast";
import editPdfName from "../../lib/editPdfName";
import AllPdfsSkeleton from "../Ui/AllPdfSkeleton";

function AllPdfs() {
  const [allPdfs, setAllPdfs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedFile, setEditedFile] = useState(null);
  const [loading , setLoading ]= useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    RetrieveAllPdf();
  }, []);

  async function RetrieveAllPdf() {
    try {
      const data = await getAllPdfs();
      if (!data.success) {
        toast.error(data.msg);
        return;
      }
      setAllPdfs(data.allPdfs);
    } catch (err) {
      toast.error(err.message);
    }
    finally{
        setLoading(false);
    }
  }

  const handleEditName = async(pdf) => {
    setEditingId(pdf._id);
    setEditedName(pdf.name);
  };

  const handleSaveName =async(id) => {
    try{
        await editPdfName(id , editedName);
        setAllPdfs(prev =>
            prev.map((pdf)=>
            pdf._id === id ? { ...pdf , name : editedName } : pdf
        ))

        toast.success("Pdf name changed successfully");
        setEditingId(null)
    }
    catch(err){
        toast(err.message)
    }
  };

  const handleEditPdf = (pdf) => {
    setEditingId(pdf._id);
    setEditedFile(null);
  };

  const handleSavePdf = (id) => {
    if (!editedFile) {
      toast.error("No file selected");
      return;
    }
    setAllPdfs((prev) =>
      prev.map((pdf) =>
        pdf._id === id
          ? { ...pdf, file: editedFile, size: editedFile.size }
          : pdf
      )
    );
    setEditingId(null);
    toast.success("PDF updated (frontend only)");
  };

  const handleOpen = (pdf) => {
    const url = pdf.fileUrl || URL.createObjectURL(pdf.file);
    window.open(url, "_blank");
  };

  if(loading){
    return <AllPdfsSkeleton/>
  }

  return (
    <div className="w-[100dvw] min-h-screen p-6">
      <div className="overflow-x-auto">
        <div className="hidden sm:grid grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] bg-gray-100 font-semibold text-gray-700 px-4 py-3 rounded-t-xl">
          <div>SL No</div>
          <div>Name</div>
          <div>Size</div>
          <div>Date</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-b-xl">
          {allPdfs.map((pdf, index) => (
            <div
              key={pdf._id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] items-center px-4 py-3 gap-2 sm:gap-4"
            >
              <div>{index + 1}</div>
              <div className="truncate overflow-hidden">
                {editingId === pdf._id && editedName ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full sm:max-w-full border border-gray-300 rounded-lg px-2 py-1 truncate"
                  />
                ) : (
                  <span className=" whitespace-normal break-all">{pdf.name}</span>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {(pdf.size / 1024).toFixed(2)} KB
              </div>

              <div className="text-sm text-gray-600">
                {new Date(pdf.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2 sm:col-span-2">
                {editingId === pdf._id && editedName ? (
                  <button
                    onClick={() => handleSaveName(pdf._id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Save Name
                  </button>
                ) : editingId === pdf._id && editedFile ? (
                  <button
                    onClick={() => handleSavePdf(pdf._id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Save PDF
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditName(pdf)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit Name
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setEditedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => {
                        setEditingId(pdf._id);
                        fileInputRef.current.click();
                      }}
                      className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                    >
                      Edit PDF
                    </button>

                    <button
                      onClick={() => handleOpen(pdf)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Open
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllPdfs;
