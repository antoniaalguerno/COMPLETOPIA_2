import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';
import {
  MdOutlineEmail,
  MdLockOutline,
  MdVisibility,
  MdVisibilityOff
} from 'react-icons/md';
import logoCompletetopia from '../pages/logo1.png';
import { login } from '../api/auth'; // <-- IMPORTAMOS NUESTRA FUNCIÓN

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      console.log('✅ Login exitoso');
      navigate('/inicio');
    } catch (error: any) {
      console.error('Error en login:', error);
      alert(error.message || 'Error al iniciar sesión');
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
        <img
          src={logoCompletetopia}
          alt="Logo Completetopia"
          className="logo-image"
        />
      </div>
    </div>
  );
};
