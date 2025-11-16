import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/userdetails.css';
import { getUser } from '../api/admin'; // <-- IMPORTAMOS LA FUNCIÓN

interface UserDetailsData {
  rut: string;
  contacto: string;
  correo: string;
  direccion: string;
  first_name: string;
  last_name: string;
  profile_image?: string | null;
}

export const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserDetailsData>({
    rut: '',
    contacto: '',
    correo: '',
    direccion: '',
    first_name: '',
    last_name: '',
    profile_image: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        // USAMOS LA FUNCIÓN DE LA API
        const data = await getUser(userId);

        setUserData({
          rut: data.rut || '',
          contacto: data.mobile || '',
          correo: data.email || '',
          direccion: data.address || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          profile_image: data.profile_image || null
        });
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        alert('No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleBack = () => navigate(-1);

  if (loading) return <p>Cargando usuario...</p>;

  const profileImgUrl = userData.profile_image
    ? `http://127.0.0.1:8000/media/${userData.profile_image}`
    : null;

  return (
    <div className="user-details-page">
      <h2>Detalles del usuario</h2>

      <div className="details-card">
        <div className="profile-header">
          {profileImgUrl ? (
            <img
              src={profileImgUrl}
              alt="Foto de perfil"
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-placeholder">
              <span>Foto de Perfil</span>
            </div>
          )}

          <h3 className="profile-name">
            {userData.first_name} {userData.last_name}
          </h3>
        </div>

        <div className="details-info-box">
          <div className="info-item">
            <strong>RUT:</strong> {userData.rut}
          </div>
          <div className="info-item">
            <strong>Contacto:</strong> {userData.contacto}
          </div>
          <div className="info-item">
            <strong>Correo:</strong> {userData.correo}
          </div>
          <div className="info-item">
            <strong>Dirección:</strong> {userData.direccion}
          </div>
        </div>

        <div className="details-actions">
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
