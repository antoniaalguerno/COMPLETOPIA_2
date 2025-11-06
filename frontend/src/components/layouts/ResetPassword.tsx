import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdSecurity } from 'react-icons/md';
import '../../css/resetpassword.css';

export const ResetPassword: React.FC = () => {
  const { uid, token } = useParams(); // capturamos parámetros desde la URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedPassword !== trimmedConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (trimmedPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    console.log("Contraseña a enviar:", trimmedPassword);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/administrator/users/reset-password-confirm/${uid}/${token}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ new_password: trimmedPassword }),
        }
      );

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        alert(data.error || 'Error al restablecer la contraseña');
        return;
      }

      setIsSuccess(true);

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Hubo un problema con la conexión al servidor.");
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-container">
        <div className="success-card">
          <h2 className="success-title">Restablecimiento de contraseña completado</h2>
          <p className="success-text">
            Su contraseña ha sido establecida. Ahora puede seguir adelante e iniciar sesión.
          </p>
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
