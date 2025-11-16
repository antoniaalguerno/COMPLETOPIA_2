// src/api/inventario.ts
import api from './client';

// Definimos el tipo de dato para reutilizarlo
export type InventoryItem = {
    id: number;
    supply_name: string;
    supply_code: string;
    supply_unit: string;
    supply_initial_stock: number;
    supply_input: number;
    supply_output: number;
    supply_total: number;
};

// --- OBTENER DATOS (GET) ---

export async function getInventory(query: string = ''): Promise<InventoryItem[]> {
  const response = await api.get('/inventario/products/', {
    params: { q: query }
  });
  return response.data;
}

export async function getProduct(id: string): Promise<InventoryItem> {
  const response = await api.get(`/inventario/products/${id}/`);
  return response.data;
}

export async function getLowStock(): Promise<InventoryItem[]> {
  const response = await api.get('/inventario/low-stock/');
  return response.data;
}

// --- CREAR DATOS (POST) ---

export async function createProduct(productData: any) {
  const response = await api.post('/inventario/products/create/', productData);
  return response.data;
}

// --- ACTUALIZAR DATOS (PUT) ---

export async function updateProduct(id: string, productData: any) {
  const response = await api.put(`/inventario/products/${id}/update/`, productData);
  return response.data;
}

// --- ELIMINAR DATOS (DELETE) ---

export async function deleteProduct(id: number) {
  const response = await api.delete(`/inventario/products/${id}/delete/`);
  return response.data; // o response.status si no devuelve nada
}