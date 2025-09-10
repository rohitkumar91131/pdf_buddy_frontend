export async function signupUser({ email, password }) {
  try{
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      "credentials" : "include"
    });
    return res.json();
  }
  catch(err){
    throw new Error(err.message || "Network error")
  }
}
  