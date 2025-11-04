import React, { useState } from 'react';
import './style.css'; // Importamos los estilos
import { MdOutlineEmail, MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';

// Asumimos que tienes el logo en la carpeta 'src/assets'
// ¡Debes descargar o crear este logo tú mismo!
import logoCompletetopia from './logo1.png';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría tu lógica de autenticación
        console.log({ email, password });
    };

    return (
        <div className="login-container">

            {/* Panel Izquierdo: Formulario */}
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

                    <a href="#" className="forgot-password-link">
                        ¿Olvidaste tu contraseña?
                    </a>

                    <button type="submit" className="login-button">
                        Iniciar sesión
                    </button>
                </form>
            </div>

            {/* Panel Derecho: Logo */}
            <div className="logo-panel">
                <img src={logoCompletetopia} alt="Logo Completetopia" className="logo-image" />
            </div>

        </div>
    );
};