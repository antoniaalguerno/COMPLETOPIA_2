import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';
import { MdOutlineEmail, MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
// Asegúrate de tener este logo en src/assets/
import logoCompletetopia from '../pages/logo1.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guarda los tokens en localStorage
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('✅ Login exitoso', data);
      navigate('/inicio'); // redirige al inicio
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error en login:', error);
    alert('Ocurrió un error al intentar iniciar sesión');
  }
};


  return (
    <div className="login-container">
      <div className="form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar sesión</h2>

          <div className="input-group">
            <MdOutlineEmail className="input-icon" />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <MdLockOutline className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-icon"
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </span>
          </div>

          <Link to="/recuperar-contrasena" className="forgot-password-link">
  ¿Olvidaste tu contraseña?
</Link>

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
      </div>

      <div className="logo-panel">
        <img src={logoCompletetopia} alt="Logo Completetopia" className="logo-image" />
      </div>
    </div>
  );
};
