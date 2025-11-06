import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    MdAdd,
    MdSearch,
    MdEdit,
    MdDelete,
    MdArrowBack
} from 'react-icons/md';
import '../css/Inventory.css';
// Importamos también el CSS del dashboard para reutilizar los estilos de las pestañas
import '../css/InventoryDashboard.css'; 

type InventoryItem = {
    id: number;
    producto: string;
    codigo: string;
    unidad: string;
    stockInicial: number;
    entradas: number;
    salidas: number;
    total: number;
};

const staticInventory: InventoryItem[] = [
    {
        id: 1,
        producto: 'pan',
        codigo: 'SKU1234',
        unidad: 'kg',
        stockInicial: 20,
        entradas: 0,
        salidas: 19,
        total: 1
    },
];

export const Inventory: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Necesario para saber qué pestaña está activa

    return (
        <div className="inventory-page">
            {/* Cabecera de la página */}
            <header className="inventory-page-header">
                <h2>Inventario</h2>
                <Link to="/inventario/nuevo" className="add-item-button">
                    <MdAdd />
                </Link>
            </header>

            {/* --- NAVEGACIÓN DE PESTAÑAS (Añadido) --- */}
            <nav className="inventory-tabs" style={{ marginBottom: '1.5rem' }}>
                <Link 
                    to="/inventario" 
                    className={`tab-item ${location.pathname === '/inventario' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                <Link 
                    to="/inventario/listado" 
                    className={`tab-item ${location.pathname === '/inventario/listado' ? 'active' : ''}`}
                >
                    Listado de inventario
                </Link>
            </nav>
            {/* ------------------------------------ */}

            {/* Tarjeta de contenido principal */}
            <div className="content-card">

                {/* Barra de herramientas dentro de la tarjeta (Flecha y Búsqueda) */}
                <div className="card-toolbar">
                    <button
                        className="back-button icon-button-large"
                        onClick={() => navigate(-1)}
                    >
                        <MdArrowBack />
                    </button>
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar por Nombre" />
                        <button className="search-button">
                            <MdSearch />
                            Buscar
                        </button>
                    </div>
                </div>

                {/* Lista de Inventario (Tabla) */}
                <div className="inventory-list">
                    {/* Cabecera de la lista */}
                    <div className="inventory-list-header">
                        <div>Producto</div>
                        <div>Codigo</div>
                        <div>Unidad</div>
                        <div className="text-right">Stock Inicial</div>
                        <div className="text-right">Entradas</div>
                        <div className="text-right">Salidas</div>
                        <div className="text-right">Total</div>
                        <div className="text-center">Acciones</div>
                    </div>

                    {/* Filas de datos */}
                    {staticInventory.map((item) => (
                        <div className="inventory-list-row" key={item.id}>
                            <div>{item.producto}</div>
                            <div>{item.codigo}</div>
                            <div>{item.unidad}</div>
                            <div className="text-right">{item.stockInicial}</div>
                            <div className="text-right">{item.entradas}</div>
                            <div className="text-right">{item.salidas}</div>
                            <div className="text-right">{item.total}</div>
                            <div className="col-actions text-center">
                                <Link to={`/inventario/editar/${item.id}`} className="action-icon">
                                    <MdEdit />
                                </Link>
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