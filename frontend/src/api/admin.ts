// src/api/admin.ts (ACTUALIZADO)
import api from './client';

// --- OBTENER DATOS (GET) ---

export async function getUser(id: string) {
  const response = await api.get(`/administrator/users/${id}/`);
  return response.data;
}

// ------------------------------------
// --- NUEVAS FUNCIONES AÑADIDAS ---
// ------------------------------------

// Combina la búsqueda y la lista de activos en una sola función
export async function getActiveUsers(query: string = '') {
  const endpoint = query
    ? `/administrator/users/search/?q=${query}`
    : '/administrator/users/active/';
  const response = await api.get(endpoint);
  return response.data;
}

export async function getBlockedUsers() {
  const response = await api.get('/administrator/users/blocked/');
  return response.data;
}

// --- ACCIONES (POST/PUT) ---

export async function createUser(data: FormData) {
  const response = await api.post('/administrator/users/create/', data);
  return response.data;
}

export async function updateUser(id: string, data: FormData) {
  const response = await api.put(`/administrator/users/${id}/edit/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// ------------------------------------
// --- NUEVAS FUNCIONES AÑADIDAS ---
// ------------------------------------

export async function blockUser(id: number) {
  // El segundo argumento {} es el body, que en este caso es vacío
  const response = await api.post(`/administrator/users/${id}/block/`, {});
  return response.data;
}

export async function activateUser(id: number) {
  const response = await api.post(`/administrator/users/${id}/activate/`, {});
  return response.data;
}