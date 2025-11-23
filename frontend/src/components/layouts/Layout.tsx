import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import { MdMenu } from 'react-icons/md';

// Importamos tus componentes
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatWidget } from './ChatWidget'; // <--- Nueva importación

import '../../css/Layout.css';

export const Layout: React.FC = () => {
    const location = useLocation();
    
    // 1. Estados
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false); // <--- Estado del Chat

    // 2. Detectamos si estamos en la página de inicio
    const isHomePage = location.pathname === '/inicio' || location.pathname === '/';

    // 3. Calculamos si la barra debe mostrarse (Lógica Original Conservada)
    // Si NO es home page, SIEMPRE debe estar abierta (true).
    // Si ES home page, depende del estado 'isSidebarOpen'.
    const showSidebar = isHomePage ? isSidebarOpen : true;

    // 4. Efecto para cerrar la sidebar automáticamente al salir del inicio (Lógica Original)
    useEffect(() => {
        if (!isHomePage) {
            setIsSidebarOpen(false); 
        }
    }, [location.pathname, isHomePage]);

    // 5. Función para abrir/cerrar el chat
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        // Mantenemos tus clases originales para no romper el CSS
        <div className={`app-container ${showSidebar ? 'sidebar-open' : 'sidebar-closed'} ${!isHomePage ? 'sidebar-static' : ''}`}>
            
            {/* --- BOTÓN HAMBURGUESA RESTAURADO --- */}
            {/* Solo se muestra si estamos en HomePage Y la barra está cerrada */}
            {isHomePage && !showSidebar && (
                <button 
                    className="hamburger-button" 
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <MdMenu />
                </button>
            )}

            <Header />
            
            <div className="body-wrapper">
                {/* Sidebar con la lógica original + la nueva prop del chat */}
                <Sidebar 
                    isOpen={showSidebar} 
                    onClose={() => setIsSidebarOpen(false)}
                    canClose={isHomePage} // Solo se cierra en Home
                    onOpenChat={() => setIsChatOpen(true)} // <--- Conexión al chat
                />
                
                <main className="content-area">
                    <Outlet />
                </main>
            </div>

            {/* --- CHAT WIDGET AÑADIDO --- */}
            {/* Se renderiza fuera del flow principal para flotar sobre todo */}
            <ChatWidget 
                isOpen={isChatOpen} 
                onToggle={toggleChat} 
            />
        </div>
    );
};