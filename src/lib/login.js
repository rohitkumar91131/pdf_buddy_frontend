export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.msg || data.message || "Login failed";
      console.error("Login Error:", msg);
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    const msg = err.message || "Network error";
    console.error("Login Fetch Error:", msg);
    throw new Error(msg);
  }
}
