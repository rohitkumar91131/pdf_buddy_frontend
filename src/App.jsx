import React from "react";
import { Toaster } from "react-hot-toast";
import {BrowserRouter ,Routes ,Route} from 'react-router-dom'
import Auth from "./pages/authpage/Auth";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/homepage(pdf_edit_page)/Home";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} /> 
      </Routes>
    </div>
  );
}
