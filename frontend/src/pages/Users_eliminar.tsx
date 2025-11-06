import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdSearch, MdRestore,} from 'react-icons/md';
import axios from 'axios';
import '../css/users.css';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export const DeletedUsers: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access');

  // 🔹 Cargar usuarios eliminados al inicio
  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/administrator/users/blocked/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios eliminados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    if (window.confirm('¿Restaurar este usuario?')) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/administrator/users/${id}/activate/`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Usuario restaurado correctamente ✅');
        fetchDeletedUsers(); // recarga la lista
      } catch (error) {
        console.error('Error al restaurar usuario:', error);
        alert('Error al restaurar el usuario ❌');
      }
    }
  };

  // 🔹 Filtrado por búsqueda
  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      <header className="users-page-header">
        <h2>Usuarios Eliminados</h2>
      </header>

      <div className="toolbar">
        <div className="tabs">
          <Link to="/usuarios" className={location.pathname === '/usuarios' ? 'active' : ''}>
            Activos
          </Link>
          <Link
            to="/usuarios/eliminados"
            className={location.pathname === '/usuarios/eliminados' ? 'active' : ''}
          >
            Eliminados
          </Link>
        </div>
      </div>

      <div className="content-card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="search-button"
            onClick={(e) => e.preventDefault()} // evita recargar la página
          >
            <MdSearch /> Buscar
          </button>
        </div>

        <div className="user-list">
          <div className="user-list-header">
            <div className="col-name">Nombre</div>
            <div className="col-email">Correo</div>
            <div className="col-actions">Acciones</div>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : filteredUsers.length === 0 ? (
            <p>No hay usuarios eliminados</p>
          ) : (
            filteredUsers.map((user) => (
              <div className="user-list-row" key={user.id}>
                <div className="col-name">
                  {user.first_name} {user.last_name}
                </div>
                <div className="col-email">{user.email}</div>
                <div className="col-actions">
                  <button className="action-icon" onClick={() => handleRestore(user.id)}>
                    <MdRestore />
                  </button>
                  {/* Aquí podrías agregar eliminar permanentemente si quieres */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
