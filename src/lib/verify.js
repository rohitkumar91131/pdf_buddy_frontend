import axios from "axios";
import toast from "react-hot-toast";

export default async function verifyUser() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/auth/verify`,
      { withCredentials: true }
    );

    if (!res.data.success) {
      throw new Error(res.data.msg || res.data.message || "Verification failed");
    }

    return true;
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Verification failed";

    console.error("Verify User Error:", msg);
    toast.error(msg);
    return false;
  }
}
