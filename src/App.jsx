import React from "react";
import { Toaster } from "react-hot-toast";
import {BrowserRouter ,Routes ,Route} from 'react-router-dom'
import Auth from "./pages/authpage/Auth";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/homepage(pdf_edit_page)/Home";
import Header from "./components/Ui/Header";
import PdfEditor from "./components/PdfComponents/PdfEditor";
import DashBoard from "./pages/dashboard/DashBoard";
import ShowPdf from "./components/PdfComponents/ShowPdf";
import PdfShowAndAnnoate from "./components/PdfShowAndAnnoatePage/PdfShowAndAnnoate";
export default function App() {
  return (
    <div>
      {/* <Header/> */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<DashBoard/>} />
        <Route path="/pdf/edit" element={<PdfEditor/>} />
        <Route path="/auth" element={<Auth/>} /> 
        <Route path="/:pdfId" element={<PdfShowAndAnnoate/>} />
      </Routes>
    </div>
  );
}
