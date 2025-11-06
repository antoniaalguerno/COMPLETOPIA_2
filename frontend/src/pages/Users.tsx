import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdPersonAdd, MdSearch, MdRemoveRedEye, MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import '../css/users.css';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

export const Users: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access');

  // 🔹 Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (searchQuery = '') => {
    setLoading(true);
    try {
      const endpoint = searchQuery
        ? `http://127.0.0.1:8000/api/administrator/users/search/active/?q=${searchQuery}`
        : `http://127.0.0.1:8000/api/administrator/users/active/`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(query);
  };
const handleDelete = async (id: number) => {
  if (window.confirm('¿Seguro que quieres bloquear (eliminar) este usuario?')) {
    try {
      await axios.post(`http://127.0.0.1:8000/api/administrator/users/${id}/block/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Usuario bloqueado correctamente ✅');
      fetchUsers(); // 🔄 Recarga la lista de usuarios activos
    } catch (error) {
      console.error('Error al bloquear usuario:', error);
      alert('Error al bloquear el usuario ❌');
    }
  }
};


  return (
    <div className="users-page">
      <header className="users-page-header">
        <h2>Usuarios</h2>
        <Link to="/usuarios/nuevo" className="add-user-button">
          <MdPersonAdd />
        </Link>
      </header>

      <div className="toolbar">
        <div className="tabs">
          <Link
            to="/usuarios"
            className={location.pathname === '/usuarios' ? 'active' : ''}
          >
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
        {/* 🔍 Barra de búsqueda */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <MdSearch />
            Buscar
          </button>
        </form>

        {/* 🧾 Lista de usuarios */}
        <div className="user-list">
          <div className="user-list-header">
            <div className="col-name">Nombre</div>
            <div className="col-email">Correo</div>
            <div className="col-actions">Acciones</div>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : users.length === 0 ? (
            <p>No hay usuarios</p>
          ) : (
            users.map((user) => (
              <div className="user-list-row" key={user.id}>
                <div className="col-name">
                  {user.first_name} {user.last_name}
                </div>
                <div className="col-email">{user.email}</div>
                <div className="col-actions">
                  <Link to={`/usuarios/${user.id}`} className="action-icon">
                    <MdRemoveRedEye />
                  </Link>
                  <Link to={`/usuarios/editar/${user.id}`} className="action-icon">
                    <MdEdit />
                  </Link>
                  <button
                    className="action-icon delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
