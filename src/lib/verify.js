import axios from "axios";

export default async function verifyUser() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/auth/verify`,
      { withCredentials: true }
    );
    return res.data; 
  } catch (err) {
    return { success: false, msg: err.message || "Verification failed" };
  }
}
