// src/api/client.ts
import axios from 'axios';

// La URL base de tu API de Django
const baseURL = import.meta.env.VITE_API_BASE_URL?? '/api/'
  //import.meta.env.VITE_API_BASE_URL; //?? 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR DE PETICIÓN (Request) ---
// Añade el token a CADA petición.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPUESTA (Response) ---
// Maneja los errores 401 (token expirado).
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        const rs = await axios.post(`${baseURL}token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = rs.data;
        localStorage.setItem('access', access);

        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        return api(originalRequest);

      } catch (_error) {
        console.error("Error al refrescar el token", _error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
