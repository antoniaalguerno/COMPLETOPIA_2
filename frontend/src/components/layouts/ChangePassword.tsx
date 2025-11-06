import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLockOutline, MdSecurity } from 'react-icons/md';
import '../../css/resetpassword.css'; 

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(
        `http://127.0.0.1:8000/api/administrator/users/${user.id}/password/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
          }),
        }
      );


      if (response.ok) {
        localStorage.clear(); // cerramos sesión
        navigate('/contrasena-actualizada'); // redirigimos a página de éxito
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Cambiar Contraseña</h2>
        <p className="reset-description">
          Para mejorar la seguridad, por favor ingrese su contraseña actual antes de crear una nueva.
        </p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
          
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
