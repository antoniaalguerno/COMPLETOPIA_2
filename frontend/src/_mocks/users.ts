import type { User } from '../types/User'; // Importa la "forma"

// Le decimos a TS que este arreglo DEBE seguir la forma de User[]
export const mockUsers: User[] = [
    { id: 1, email: 'admin@empresa.com', nombre: 'Admin Principal' },
    { id: 2, email: 'user@empresa.com', nombre: 'Usuario Básico' },
];