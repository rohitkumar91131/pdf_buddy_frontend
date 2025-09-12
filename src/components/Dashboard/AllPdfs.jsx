import React, { useEffect, useState, useRef } from "react";
import getAllPdfs from "../../lib/getAllPdfs";
import toast from "react-hot-toast";
import editPdfName from "../../lib/editPdfName";
import AllPdfsSkeleton from "../Ui/AllPdfSkeleton";
import { usePdf } from "../../context/PdfContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AllPdfs() {
  const { allPdfs, setAllPdfs } = usePdf();
  const [editing, setEditing] = useState({ id: null, type: null }); 
  const [editedName, setEditedName] = useState("");
  const [editedFile, setEditedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (allPdfs.length === 0) {
      retrieveAllPdf();
    } else {
      setLoading(false);
    }
  }, [allPdfs]);

  async function retrieveAllPdf() {
    try {
      const data = await getAllPdfs();
      if (!data.success) {
        toast.error(data.msg);
        return;
      }
      setAllPdfs(data.allPdfs);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEditName = (pdf) => {
    setEditing({ id: pdf._id, type: "name" });
    setEditedName(pdf.name);
  };

  const handleSaveName = async (id) => {
    try {
      await editPdfName(id, editedName);
      setAllPdfs((prev) =>
        prev.map((pdf) => (pdf._id === id ? { ...pdf, name: editedName } : pdf))
      );
      toast.success("PDF name changed successfully");
      setEditing({ id: null, type: null });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditFile = (pdf) => {
    setEditing({ id: pdf._id, type: "file" });
    setEditedFile(null);
    fileInputRef.current.click();
  };

  const handleSaveFile = (id) => {
    if (!editedFile) {
      toast.error("No file selected");
      return;
    }
    setAllPdfs((prev) =>
      prev.map((pdf) =>
        pdf._id === id ? { ...pdf, file: editedFile, size: editedFile.size } : pdf
      )
    );
    setEditing({ id: null, type: null });
    toast.success("PDF updated");
  };

  const handleOpen = (pdf) => {
    navigate(`/${pdf.name}`);
  };

  if (loading) {
    return <AllPdfsSkeleton />;
  }

  const handleDeletePdf = async(id) =>{
    try{
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/pdfs/${id}`,{
        withCredentials: true,
      })
      //console.log(res.data)
      if(res.data.success){
        const all = [...allPdfs];
        const restPdfs = all.filter((pdf) => pdf._id !== id);
        setAllPdfs(restPdfs);
      }
      else{
        toast(res.data.msg)
      }
    }
    catch(err){
      toast(err.message)
    }
  }

  return (
    <div className="w-[100dvw] min-h-screen p-6">
      {allPdfs.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="hidden sm:grid grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] bg-gray-100 font-semibold text-gray-700 px-4 py-3 rounded-t-xl">
            <div>SL No</div>
            <div>Name</div>
            <div>Size</div>
            <div>Date</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 border border-gray-200 rounded-b-xl">
            {allPdfs.map((pdf, index) => {
              const isEditingName = editing.id === pdf._id && editing.type === "name";
              const isEditingFile = editing.id === pdf._id && editing.type === "file";

              return (
                <div
                  key={pdf._id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] items-center px-4 py-3 gap-2 sm:gap-4"
                >
                  <div>{index + 1}</div>
                  <div className="truncate overflow-hidden">
                    {isEditingName ? (
                      <textarea
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full sm:max-w-full border border-gray-300 rounded-lg px-2 py-1  break-all"
                      ></textarea>
                    ) : (
                      <span className="whitespace-normal break-all">{pdf.name}</span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    {(pdf.size / 1024).toFixed(2)} KB
                  </div>

                  <div className="text-sm text-gray-600">
                    {new Date(pdf.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 sm:col-span-2">
                    {isEditingName ? (
                      <button
                        onClick={() => handleSaveName(pdf._id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Save Name
                      </button>
                    ) : isEditingFile ? (
                      <button
                        onClick={() => handleSaveFile(pdf._id)}
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
                          onChange={(e) => {
                            setEditedFile(e.target.files[0]);
                            setEditing({ id: pdf._id, type: "file" });
                          }}
                          className="hidden"
                        />
                        <button
                          onClick={() => handleDeletePdf(pdf._id)}
                          className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                          Delete
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
              );
            })}

            {allPdfs.length === 0 && (
              <p className="w-full h-[50dvh] flex items-center justify-center">
                No PDF found
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="w-full h-[50dvh] flex items-center justify-center">
          No PDF found
        </p>
      )}
    </div>
  );
}

export default AllPdfs;
