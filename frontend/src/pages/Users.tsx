import React, { useState } from 'react';
// 1. Importa Link y useLocation
import { Link, useLocation } from 'react-router-dom';
import {
    MdPersonAdd,
    MdFileUpload,
    MdSearch,
    MdRemoveRedEye,
    MdEdit,
    MdDelete
} from 'react-icons/md';
import '../css/users.css'; // Asegúrate que la ruta del CSS sea correcta

type User = {
    id: number;
    name: string;
    email: string;
};

// DATOS ESTÁTICOS: (Solo usuarios activos)
const staticUsers: User[] = [
    { id: 1, name: 'Karen Cordova', email: 'karen.cordova@cloud.uautonoma.cl' },
    { id: 2, name: 'Usuario Ejemplo', email: 'kdczzz@outlook.com' },
];

export const Users: React.FC = () => {
    // 2. 'activeTab' ahora se basa en la URL
    const location = useLocation();

    return (
        <div className="users-page">
            <header className="users-page-header">
                <h2>Usuarios</h2>
                {/* 3. Botón de Añadir (ya es un Link, ¡bien!) */}
                <Link to="/usuarios/nuevo" className="add-user-button">
                    <MdPersonAdd />
                </Link>
            </header>

            {/* 4. Barra de herramientas con ENLACES */}
            <div className="toolbar">
                <div className="tabs">
                    {/* Enlace a Activos */}
                    <Link
                        to="/usuarios"
                        // Usamos 'pathname' para saber si es la ruta exacta
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

            <div className="content-card">
                <div className="search-bar">
                    <input type="text" placeholder="Buscar por Nombre" />
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

                    {staticUsers.map((user) => (
                        <div className="user-list-row" key={user.id}>
                            <div className="col-name">{user.name}</div>
                            <div className="col-email">{user.email}</div>
                            <div className="col-actions">
                                {/* 5. Arreglamos el botón del OJO */}
                                <Link to={`/usuarios/${user.id}`} className="action-icon">
                                    <MdRemoveRedEye />
                                </Link>
                                <button className="action-icon delete"><MdDelete /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};