import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLockOutline, MdSecurity } from 'react-icons/md';
import '../../css/resetpassword.css'; 

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }

    // Aquí el backend verificaría si 'currentPassword' es correcta para el usuario logueado
    console.log("Enviando cambio de contraseña...", { currentPassword, newPassword });   
    navigate('/contrasena-actualizada');
  };

  return (
    // <div className="reset-container"> no se cual se ve mejor ajsldkajdlkaj
    <div className="">
      <div className="reset-card">
        <h2>Cambiar Contraseña</h2>
        <p className="reset-description">
          Para mejorar la seguridad, por favor ingrese su contraseña actual antes de crear una nueva.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Campo extra: Contraseña Actual */}
          <div className="input-group-reset">
            <MdLockOutline className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group-reset" style={{ marginTop: '2rem' }}>
            <MdSecurity className="input-icon" />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            Actualizar contraseña
          </button>
          
          {/* Botón para cancelar */}
          <button 
            type="button" 
            className="reset-button" 
            style={{ backgroundColor: '#ccc', color: '#333', marginTop: '10px' }}
            onClick={() => navigate(-1)}
          >
             Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};