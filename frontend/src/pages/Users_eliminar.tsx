import React, { useState } from 'react';
// 1. Importa Link y useLocation
import { Link, useLocation } from 'react-router-dom';
import {
    MdSearch,
    MdDelete,
    MdRestore 
} from 'react-icons/md';
import '../css/users.css'; // Asegúrate que la ruta del CSS sea correcta

type User = {
    id: number;
    name: string;
    email: string;
};

// DATOS ESTÁTICOS: Usuarios eliminados (hardcodeados)
const deletedUsers: User[] = [
    { id: 3, name: 'Usuario Eliminado 1', email: 'eliminado1@example.com' },
    { id: 4, name: 'Usuario Eliminado 2', email: 'eliminado2@example.com' },
];

export const DeletedUsers: React.FC = () => {
    // 2. 'activeTab' ahora se basa en la URL
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="users-page">
            <header className="users-page-header">
                <h2>Usuarios Eliminados</h2>
            </header>

            {/* 3. Barra de herramientas con ENLACES */}
            <div className="toolbar">
                <div className="tabs">
                    {/* Enlace a Activos */}
                    <Link 
                        to="/usuarios"
                        className={location.pathname === '/usuarios' ? 'active' : ''}
                    >
                        Activos
                    </Link>
                    {/* Enlace a Eliminados */}
                    <Link
                        to="/usuarios/eliminados"
                        className={location.pathname === '/usuarios/eliminados' ? 'active' : ''}
                    >
                        Eliminados
                    </Link>
                </div>
            </div>

            {/* Contenedor principal de la lista */}
            <div className="content-card">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar por Nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button">
                        <MdSearch />
                        Buscar
                    </button>
                </div>

                <div className="user-list">
                    <div className="user-list-header">
                        <div className="col-name">Nombre</div>
                        <div className="col-email">Correo</div>
                        <div className="col-actions">Acciones</div>
                    </div>

                    {deletedUsers
                        .filter((user) =>
                            user.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((user) => (
                            <div className="user-list-row" key={user.id}>
                                <div className="col-name">{user.name}</div>
                                <div className="col-email">{user.email}</div>
                                <div className="col-actions">
                                    <button className="action-icon">
                                        <MdRestore />
                                    </button>
                                    <button className="action-icon delete">
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};