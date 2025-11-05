import React from 'react';
import { MdHome, MdGroup, MdInventory } from 'react-icons/md';
import logo from '../../pages/logo1.png'; // Re-usa tu logo
import '../../css/layout.css';

type NavLink = 'Inicio' | 'Usuarios' | 'Inventario';
export const Sidebar: React.FC = () => {
    // Define el tipo de activeLink como un tipo literal
    const activeLink: NavLink = 'Usuarios'; // Cambia esto para probar diferentes enlaces activos

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    <li className={activeLink === 'Inicio' ? 'active' : ''}>
                        <a href="#">
                            <MdHome />
                            <span>Inicio</span>
                        </a>
                    </li>
                    <li className={activeLink === 'Usuarios' ? 'active' : ''}>
                        <a href="#">
                            <MdGroup />
                            <span>Usuarios</span>
                        </a>
                    </li>
                    <li className={activeLink === 'Inventario' ? 'active' : ''}>
                        <a href="#">
                            <MdInventory />
                            <span>Inventario</span>
                        </a>
                    </li>
                </ul>
            </nav>


        </aside>

    );
};