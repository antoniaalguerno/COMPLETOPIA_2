// src/api/auth.ts
export async function login(email: string, password: string) {
  const response = await fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Credenciales inválidas");
  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data;
}
