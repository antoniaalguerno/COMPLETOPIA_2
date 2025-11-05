import React, { useState } from 'react';
import {
    MdPersonAdd,
    MdFileUpload,
    MdSearch,
    MdRemoveRedEye,
    MdEdit,
    MdDelete
} from 'react-icons/md';
import '../css/users.css';

// TypeScript: Definimos el tipo para un usuario
type User = {
    id: number;
    name: string;
    email: string;
};

// DATOS ESTÁTICOS: Como solicitaste, los usuarios están hardcodeados
const staticUsers: User[] = [
    { id: 1, name: 'Karen Cordova', email: 'karen.cordova@cloud.uautonoma.cl' },
    { id: 2, name: 'Usuario Ejemplo', email: 'kdczzz@outlook.com' },
];

export const Users: React.FC = () => {
    const [activeTab, setActiveTab] = useState('activos');

    return (
        <div className="users-page">
            {/* Cabecera de la página de usuarios */}
            <header className="users-page-header">
                <h2>Usuarios</h2>
                <button className="add-user-button">
                    <MdPersonAdd />
                </button>
            </header>

            {/* Barra de herramientas con tabs y botón de exportar */}
            <div className="toolbar">
                <div className="tabs">
                    <button
                        className={activeTab === 'activos' ? 'active' : ''}
                        onClick={() => setActiveTab('activos')}
                    >
                        Activos
                    </button>
                    <button
                        className={activeTab === 'eliminados' ? 'active' : ''}
                        onClick={() => setActiveTab('eliminados')}
                    >
                        Eliminados
                    </button>
                </div>

            </div>

            {/* Contenedor principal de la lista */}
            <div className="content-card">
                {/* Barra de búsqueda */}
                <div className="search-bar">
                    <input type="text" placeholder="Buscar por Nombre" />
                    <button className="search-button">
                        <MdSearch />
                        Buscar
                    </button>
                </div>

                {/* Lista de Usuarios (Estática) */}
                <div className="user-list">
                    {/* Cabecera de la lista */}
                    <div className="user-list-header">
                        <div className="col-name">Nombre</div>
                        <div className="col-email">Correo</div>
                        <div className="col-actions">Acciones</div>
                    </div>

                    {/* Filas de datos (generadas desde el array estático) */}
                    {staticUsers.map((user) => (
                        <div className="user-list-row" key={user.id}>
                            <div className="col-name">{user.name}</div>
                            <div className="col-email">{user.email}</div>
                            <div className="col-actions">
                                <button className="action-icon"><MdRemoveRedEye /></button>
                                <button className="action-icon"><MdEdit /></button>
                                <button className="action-icon delete"><MdDelete /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
