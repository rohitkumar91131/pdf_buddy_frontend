import React from "react";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center h-[10dvh]">
      <Link to="/" className="flex items-center gap-2">
        <FileText className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800 hidden sm:block">PDFBuddy</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/auth"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
