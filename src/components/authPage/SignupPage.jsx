import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { signupUser } from "../../lib/signup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLogin, setIsLoginPageInTheWindow } = useAuth();
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signupUser(form);
      const msg = data.message || data.msg || "Signup failed";

      if (data.success) {
        toast.success(msg);
        setIsLogin(true);           
        navigate(-1);     
      } else {
        toast.error(msg);
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    }
    setLoading(false);
  };

  return (
    <div className="h-[90dvh] flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row">

        <div className="flex items-center justify-center bg-gray-50 p-6 md:w-1/2">
          <img
            src="/icon.svg"
            alt="Signup illustration"
            className="w-32 h-32 md:w-60 md:h-60"
          />
        </div>

        <div className="p-6 flex flex-col justify-center md:w-1/2">
          <h1 className="text-2xl font-bold text-center mb-2">Signup Form</h1>
          <p className="text-center text-gray-600 mb-6">
            Create your PdfBuddy account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <UserPlus size={20} />
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => setIsLoginPageInTheWindow(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
