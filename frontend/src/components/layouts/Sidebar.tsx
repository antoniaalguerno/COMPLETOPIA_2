import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdGroup, MdInventory, MdChevronLeft } from 'react-icons/md';
import logo from '../../pages/logo1.png'; 
import '../../css/layout.css';

// Añadimos 'canClose' a la interfaz
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    canClose: boolean; // Nueva prop
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, canClose }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === '/' && currentPath === '/') return true;
        if (path !== '/' && currentPath.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
            
            {/* SOLO mostramos el botón de cerrar si 'canClose' es true */}
            {canClose && (
                <button className="close-sidebar-button" onClick={onClose}>
                    <MdChevronLeft />
                </button>
            )}

            <nav className="sidebar-nav">
                <ul>
                    <li className={isActive('/inicio') ? 'active' : ''}>
                        <Link to="/inicio">
                            <MdHome />
                            <span>Inicio</span>
                        </Link>
                    </li>
                    <li className={isActive('/usuarios') ? 'active' : ''}>
                        <Link to="/usuarios">
                            <MdGroup />
                            <span>Usuarios</span>
                        </Link>
                    </li>
                    <li className={isActive('/inventario') ? 'active' : ''}>
                        <Link to="/inventario">
                            <MdInventory />
                            <span>Inventario</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="floating-logo">
                 <img src={logo} alt="Completetopia Logo" />
            </div>
        </aside>
    );
};
