import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Importamos useLocation
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MdMenu } from 'react-icons/md';
import '../../css/layout.css';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. Detectamos si estamos en la página de inicio
  const isHomePage = location.pathname === '/inicio';

  // 2. Calculamos si la barra debe mostrarse.
  // Si NO es home page, SIEMPRE debe estar abierta (true).
  // Si ES home page, depende del estado 'isSidebarOpen'.
  const showSidebar = isHomePage ? isSidebarOpen : true;

  // (Opcional) Efecto para cerrar la sidebar automáticamente al cambiar de ruta
  // si estabas en inicio y navegas a otra parte, y luego vuelves.
  useEffect(() => {
      if (!isHomePage) {
          setIsSidebarOpen(false); // Reseteamos el estado al salir de inicio
      }
  }, [location.pathname, isHomePage]);

  return (
    // Añadimos una clase extra si estamos en modo 'static' (no home) por si la necesitas en CSS
    <div className={`app-container ${showSidebar ? 'sidebar-open' : 'sidebar-closed'} ${!isHomePage ? 'sidebar-static' : ''}`}>
      
      {/* 3. El botón de hamburguesa SOLO se muestra si estamos en HomePage Y la barra está cerrada */}
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
        {/* 4. Pasamos 'showSidebar' calculado y una nueva prop 'canClose' */}
        <Sidebar 
            isOpen={showSidebar} 
            onClose={() => setIsSidebarOpen(false)}
            canClose={isHomePage} // Solo se puede cerrar si estamos en HomePage
        />
        
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};