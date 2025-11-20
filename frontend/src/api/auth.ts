// src/api/auth.ts
import api from './client'; // <-- 1. Importa nuestro cliente

// Tu función login ahora usa 'api.post'
export async function login(email: string, password: string) {
  try {
    // 2. Usa 'api.post' y la ruta relativa (la base ya está en el cliente)
    const response = await api.post("login/", { email, password });

    // 3. Con Axios, los datos están en 'response.data'
    const data = response.data;
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh); // <-- Asegúrate de guardar el refresh token
    localStorage.setItem("user", JSON.stringify(data.user)); // <-- También lo guardamos

    return data;

  } catch (error: any) {
    // 4. Si falla, lanza un error para que el componente lo atrape
    console.error("Error en login (auth.ts):", error);
    const errorMsg = error.response?.data?.detail || "Credenciales inválidas";
    throw new Error(errorMsg);
  }
}

// Puedes añadir la función de logout aquí también
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  // Opcional: llamar a un endpoint de 'blacklist' si lo tienes
  // api.post('/logout/'); 
  window.location.href = "/login";
}
