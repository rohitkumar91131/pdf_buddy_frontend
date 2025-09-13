export async function signupUser({ email, password }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.msg || data.message || "Signup failed";
      console.error("Signup Error:", msg);
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    const msg = err.message || "Network error";
    console.error("Signup Fetch Error:", msg);
    throw new Error(msg);
  }
}
