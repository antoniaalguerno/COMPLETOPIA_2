import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSecurity } from 'react-icons/md';
import '../../css/resetpassword.css';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Contraseña cambiada exitosamente");
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="reset-container">
        <div className="success-card">
          <h2 className="success-title">Restablecimiento de contraseña completado</h2>
          <p className="success-text">
            Su contraseña ha sido establecida. Ahora puede seguir adelante e iniciar sesión.
          </p>
          {/* Botón para ir al login */}
          <button className="login-link-button" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Escriba la Nueva Contraseña</h2>
        <p className="reset-description">
          Por favor, introduzca su contraseña nueva dos veces para verificar que la ha escrito correctamente.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group-reset">
            <MdSecurity className="input-icon" />
            <input
              type="password"
              placeholder="Introduce la nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="input-group-reset">
            <MdSecurity className="input-icon" />
            <input
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-button">
            Cambiar mi contraseña
          </button>
        </form>
      </div>
    </div>
  );
};