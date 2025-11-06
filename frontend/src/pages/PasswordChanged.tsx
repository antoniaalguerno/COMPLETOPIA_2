import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/resetpassword.css';

export const PasswordChanged: React.FC = () => {
  const navigate = useNavigate();

  return (
    // Usamos 'reset-container' para que centre todo en la pantalla blanca
    <div className="reset-container">
      <div className="success-card">
        <h2 className="success-title">Contraseña actualizada</h2>
        <p className="success-text">
          Su contraseña ha sido modificada exitosamente.
        </p>
        <p className="success-text">
          Por seguridad, su sesión ha sido cerrada. Por favor, inicie sesión nuevamente.
        </p>
        <button className="login-link-button" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};