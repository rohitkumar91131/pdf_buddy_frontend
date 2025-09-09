export async function loginUser({ email, password }) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      "credentials" : 'include'
    });
    return res.json();
  }
  