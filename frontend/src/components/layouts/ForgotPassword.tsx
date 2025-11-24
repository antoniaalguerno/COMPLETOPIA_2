import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import '../../css/forgotpassword.css';
import logo from '../../pages/logo1.png';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/administrator/users/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al enviar el correo de restablecimiento');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor');
      console.error(error);
    }
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
};
