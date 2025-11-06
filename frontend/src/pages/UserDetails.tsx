import React from 'react';
// Importamos hooks para navegación y para leer parámetros de la URL
import { useNavigate, useParams } from 'react-router-dom';
import '../css/userdetails.css'; // Crearemos este archivo

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Leemos el 'ID' de la URL
  // Si la URL es "/usuarios/1", userId será "1"
//   const { userId } = useParams<{ userId: string }>();

  // 2. --- DATOS ESTÁTICOS ---
  // Como pediste, los datos son estáticos por ahora.
  // En el futuro, usarías el 'userId' para buscar este
  // usuario en tu base de datos.
  const staticData = {
    rut: '21165452-k',
    contacto: '95435554',
    correo: 'kdczzz@outlook.com',
    direccion: 'piopiopiop,Buin, Región Metropolitana de Santiago'
  };

  // 3. Función para el botón "Volver"
  const handleBack = () => {
    navigate(-1); // Vuelve a la página anterior (la lista de usuarios)
  };

  return (
    <div className="user-details-page">
      <h2>Detalles del usuario</h2>

      <div className="details-card">
        {/* Cabecera con foto de perfil */}
        <div className="profile-header">
          <div className="profile-picture-placeholder">
            <span>Foto de Perfil</span>
          </div>
        </div>

        {/* Información en el recuadro */}
        <div className="details-info-box">
          <div className="info-item">
            <strong>RUT:</strong> {staticData.rut}
          </div>
          <div className="info-item">
            <strong>Contacto:</strong> {staticData.contacto}
          </div>
          <div className="info-item">
            <strong>Correo:</strong> {staticData.correo}
          </div>
          <div className="info-item">
            <strong>Dirección:</strong> {staticData.direccion}
          </div>
        </div>

        {/* Botón de Volver */}
        <div className="details-actions">
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};