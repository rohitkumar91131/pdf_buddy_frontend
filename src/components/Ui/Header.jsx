import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import verifyUser from "../../lib/verify";
import logoutUser from "../../lib/logout";

export default function Header() {
  const { isLogin, setIsLogin } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyUser();
        setIsLogin(res);
      } catch (err) {
        console.error("Auth check failed:", err.message);
        setIsLogin(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await logoutUser();
      if (res.success) {
        setIsLogin(false);
        navigate("/auth");
      } else {
        console.error(res.msg);
      }
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center h-[10dvh]">
      <Link to="/" className="flex items-center gap-2">
        <FileText className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800 hidden sm:block">
          PDFBuddy
        </span>
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

        {isLogin ? (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`${
              loggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } text-white px-4 py-2 rounded-lg transition-colors font-medium`}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <Link
            to="/auth"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
