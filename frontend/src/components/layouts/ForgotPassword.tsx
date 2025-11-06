import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import '../../css/forgotpassword.css';
import logo from '../../pages/logo1.png';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Solicitud de recuperación para:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="forgot-container">
        <div className="sent-card">
          <h2 className="sent-title">Restablecimiento de Contraseña Enviado</h2>
          <p className="sent-text">
            Se han enviado instrucciones de restablecimiento de contraseña a su correo electrónico.
          </p>
          <p className="sent-text">
            Revise su bandeja de entrada, incluida la carpeta de spam, si no recibe el correo en breve.
          </p>
          {/* Botón para volver al login */}
          <button className="return-button" onClick={() => navigate('/login')}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        
        {/* Lado Izquierdo: Formulario */}
        <div className="forgot-form-section">
          <h2>Restablecer Contraseña</h2>
          <p className="forgot-description">
            ¿Olvidó su contraseña? Ingrese su correo electrónico y le enviaremos instrucciones para restablecerla.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group-forgot">
              <MdOutlineEmail className="input-icon" />
              <input
                type="email"
                placeholder="Introduce tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="confirm-button">
              Confirmar
            </button>
          </form>
        </div>

        {/* Lado Derecho: Logo */}
        <div className="forgot-logo-section">
          <img src={logo} alt="Logo Completetopia" />
        </div>

      </div>
    </div>
  );
}