import React, { useState } from 'react';
import '../css/login.css';
import { MdOutlineEmail, MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import logoCompletetopia from './logo1.png';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error desconocido');
        }

        console.log('✅ Login exitoso:', data);

        // Guardamos tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // 🔹 Redirige a /usuarios (Users.tsx)
        navigate('/usuarios');

    } catch (error: any) {
        console.error('❌ Error al iniciar sesión:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
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

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Iniciando...' : 'Iniciar sesión'}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

            {/* Panel Derecho: Logo */}
            <div className="logo-panel">
                <img src={logoCompletetopia} alt="Logo Completetopia" className="logo-image" />
            </div>
        </div>
    );
};
