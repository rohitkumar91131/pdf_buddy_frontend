import React from "react";
import { Toaster } from "react-hot-toast";
import {BrowserRouter ,Routes ,Route} from 'react-router-dom'
import Auth from "./pages/authpage/Auth";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/homepage(pdf_edit_page)/Home";
import Header from "./components/Ui/Header";
export default function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} /> 
      </Routes>
    </div>
  );
}
