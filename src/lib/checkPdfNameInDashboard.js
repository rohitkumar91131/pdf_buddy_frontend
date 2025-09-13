import axios from 'axios';
import toast from 'react-hot-toast';

export default async function checkNameExists(name) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/pdfs/check_name_in_user_dashboard/${name}`,
      { withCredentials: true }
    );

    if (!res.data.success) {
      throw new Error(res.data.msg || res.data.message || "Something went wrong");
    }

    return true;
  } catch (err) {
    const errorMsg =
      err.response?.data?.msg ||
      err.response?.data?.message ||
      err.message ||
      "Server error";
    toast.error(errorMsg);
    return false;
  }
}
