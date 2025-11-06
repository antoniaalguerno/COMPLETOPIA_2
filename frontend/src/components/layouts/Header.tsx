import React, { useState, useEffect, useRef } from 'react';
// 1. Importamos useNavigate además de Link
import { Link, useNavigate } from 'react-router-dom'; 
import { 
  MdPerson, 
  MdSettings, 
  MdLogout,
  MdLockOutline,
  MdEdit,
  MdVisibility,
  MdChevronRight
} from 'react-icons/md';
import '../../css/Layout.css'; 

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // 2. Inicializamos el hook de navegación
  const navigate = useNavigate();

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (!isMenuOpen) return;
          if (
              menuRef.current && !menuRef.current.contains(event.target as Node) &&
              triggerRef.current && !triggerRef.current.contains(event.target as Node)
          ) {
              setIsMenuOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [isMenuOpen]);

  const currentUserId = 1; 

  // 3. Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Aquí podrías limpiar el almacenamiento local (ej. localStorage.removeItem('token'))
    console.log("Cerrando sesión...");
    navigate('/login'); // Redirige al login
  };

  return (
    <header className="header">
      
      <Link to={`/usuarios/${currentUserId}`} className="user-info-link">
        <div className="user-info">
          <MdPerson className="user-avatar" />
          <span>Karen</span>
        </div>
      </Link>

      <div className="header-actions">
        <button
          className="icon-button"
          ref={triggerRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MdSettings />
        </button>

        {/* 4. Añadimos el evento onClick al botón de logout */}
        <button className="icon-button" onClick={handleLogout}>
          <MdLogout />
        </button>

        {isMenuOpen && (
          <div className="settings-menu" ref={menuRef}>
            <ul>
              <li>
                <Link to="/cambiar-contrasena">
                  <MdLockOutline />
                  <span>Contraseña</span>
                  <MdChevronRight />
                </Link>
              </li>
              <li>
                <Link to={`/usuarios/editar/${currentUserId}`}>
                  <MdEdit />
                  <span>Editar Perfil</span>
                  <MdChevronRight />
                </Link>
              </li>
              <li>
                <Link to={`/usuarios/${currentUserId}`}>
                  <MdVisibility />
                  <span>Ver perfil</span>
                  <MdChevronRight />
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};