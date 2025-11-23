import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdGroup, MdInventory, MdChevronLeft } from 'react-icons/md';
import logo from '../../pages/logo1.png'; 
import '../../css/Layout.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    canClose: boolean;
    onOpenChat: () => void; // 1. Nueva prop para abrir el chat
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, canClose, onOpenChat }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === '/' && currentPath === '/') return true;
        if (path !== '/' && currentPath.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
            
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

            {/* 2. Hacemos el logo clickeable */}
            <div 
                className="floating-logo" 
                onClick={onOpenChat} 
                style={{ cursor: 'pointer' }} // Estilo inline rápido para indicar click
                title="Haz clic para abrir el asistente"
            >
                 <img src={logo} alt="Completetopia Logo" />
            </div>
        </aside>
    );
};