import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import logo from '../../pages/logo1.png'; // Importa el logo
import '../../css/layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <div className="body-wrapper">
                <Sidebar />
                <main className="content-area">
                    {children}
                </main>
            </div>
            {/* Logo fuera del Sidebar */}
            <div className="floating-logo">
                <img src={logo} alt="Completetopia Logo" />
            </div>
        </div>
    );
};