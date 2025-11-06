import React, { useState, useEffect, useRef } from 'react';
import { 
  MdPerson, 
  MdSettings, 
  MdLogout,
  // --- Iconos para el nuevo menú ---
  MdLockOutline,
  MdEdit,
  MdVisibility,
  MdChevronRight
} from 'react-icons/md';
// Asegúrate de que la ruta del CSS sea la correcta
import '../../css/Layout.css'; 

export const Header: React.FC = () => {
  // 1. Hook de Estado para saber si el menú está abierto
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Hooks de Referencia para cerrar el menú al hacer clic afuera
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 3. Hook de Efecto para manejar el "clic afuera"
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el menú está cerrado, no hagas nada
      if (!isMenuOpen) return;

      // Si el clic fue FUERA del menú Y FUERA del botón de tuerca
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false); // Cierra el menú
      }
    };

    // Agrega el listener
    document.addEventListener('mousedown', handleClickOutside);
    // Limpia el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]); // Este efecto depende de 'isMenuOpen'

  return (
    <header className="header">
      <div className="user-info">
        <MdPerson className="user-avatar" />
        <span>Karen</span>
      </div>

      <div className="header-actions">
        {/* 4. Botón de Configuración (tuerca) */}
        <button
          className="icon-button"
          ref={triggerRef} // <-- Asigna la referencia al botón
          onClick={() => setIsMenuOpen(!isMenuOpen)} // <-- Cambia el estado
        >
          <MdSettings />
        </button>

        <button className="icon-button">
          <MdLogout />
        </button>

        {/* 5. El Menú Desplegable (Renderizado condicional) */}
        {isMenuOpen && (
          <div className="settings-menu" ref={menuRef}> {/* <-- Asigna la ref al menú */}
            <ul>
              <li>
                <a href="#">
                  <MdLockOutline />
                  <span>Contraseña</span>
                  <MdChevronRight />
                </a>
              </li>
              <li>
                <a href="#">
                  <MdEdit />
                  <span>Editar Perfil</span>
                  <MdChevronRight />
                </a>
              </li>
              <li>
                <a href="#">
                  <MdVisibility />
                  <span>Ver perfil</span>
                  <MdChevronRight />
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};