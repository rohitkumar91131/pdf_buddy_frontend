import axios from "axios";

export default async function logoutUser() {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    return { success: true };
  } catch (err) {
    const msg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Logout failed";
    console.error("Logout Error:", msg);
    return { success: false, msg };
  }
}
