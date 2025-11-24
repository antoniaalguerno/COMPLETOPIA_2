import React, { useState, useEffect, useRef } from 'react';
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
import '../../css/layout.css'; 

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; first_name: string; last_name: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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

  // 🔹 Cargar usuario logueado desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!currentUser) return null; // opcional: mostrar nada mientras cargamos

  return (
    <header className="header">
      
      <Link to={`/usuarios/${currentUser.id}`} className="user-info-link">
        <div className="user-info">
          <MdPerson className="user-avatar" />
          <span>{currentUser.first_name} {currentUser.last_name}</span>
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
                <Link to={`/usuarios/editar/${currentUser.id}`}>
                  <MdEdit />
                  <span>Editar Perfil</span>
                  <MdChevronRight />
                </Link>
              </li>
              <li>
                <Link to={`/usuarios/${currentUser.id}`}>
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
